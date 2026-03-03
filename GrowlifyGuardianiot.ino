// ESP32 Memory Safety Config
#define CONFIG_ASYNC_TCP_RUNNING_CORE 1
#define CONFIG_ASYNC_TCP_USE_WDT 0

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_heap_caps.h"

// WiFi credentials
const char* ssid = "Kumar";
const char* password = "11112222";

// Weather API
const char* weatherApiKey = "ef652dd7f8c85f6eba1ecb4dc26a9fe4";
const char* city = "Coimbatore";
const char* countryCode = "IN";

// Pin definitions
#define DHTPIN 4
#define DHTTYPE DHT11
#define SOIL_MOISTURE_PIN 34
#define RAIN_SENSOR_PIN 35
#define RELAY1_PIN 26  // Water Pump
#define RELAY2_PIN 27  // Pesticide Pump

// Safety Limits
const unsigned long MAX_PESTICIDE_DURATION = 10000; // 10 Seconds Max Spray
const unsigned long PESTICIDE_COOLDOWN = 60000;     // Wait 1 min before spraying again

// Sensors & Server
DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800, 60000);

// Sensor Variables
float temperature = 0;
float humidity = 0;
int soilMoisture = 0;
int rainDetected = 0;
bool previousRainState = false;

// Weather Variables
String weatherDescription = "";
float weatherTemp = 0;
int weatherHumidity = 0;

// Relay State Tracking
bool relay1State = false; 
bool relay2State = false; 

// ==========================================
// 🔴 AUTOMATION FLAGS
// ==========================================

bool relay1TimerEnabled = false;      // Timer Mode
bool predictiveModeEnabled = false;   // Predictive Mode (Soil)
bool pesticideAutoEnabled = false;    // Pesticide Auto Mode

// Timer Settings
int relay1OnHour = 6;
int relay1OnMinute = 0;
int relay1OffHour = 18;
int relay1OffMinute = 0;

// Logic Settings
int soilMoistureThreshold = 3000;
bool isIndoorPlant = false;

// Usage Tracking
const int FLOW_RATE_ML_PER_SEC = 6;
unsigned long relay1StartTime = 0;
unsigned long relay2StartTime = 0;
unsigned long lastPesticideRunTime = 0; 
float totalWaterUsed = 0;
float totalPesticideUsed = 0;

// History
struct PumpHistory {
  String timestamp;
  String pumpType;
  String action;
  float duration;
  float amountUsed;
};
#define MAX_HISTORY 20
PumpHistory history[MAX_HISTORY];
int historyCount = 0;

// ==========================================
// 🔴 FUNCTION PROTOTYPES
// ==========================================
void readSensors();
void checkRainSafety();
void checkPredictiveMode();
void checkPesticideAutoMode();
void checkRelay1Timer();
void getWeatherData();
void addHistoryEntry(String pumpType, String action, float duration, float amount);

// HTTP Handler Prototypes
void handleRoot();
void handleGetData();
void handleToggleRelay1();
void handleToggleRelay2();
void handleSetTimer();
void handleSetAutonomous();  // Maps to Predictive Mode
void handleSetPesticideAuto();
void handleSetPlantType();
void handleGetHistory();
void handleClearHistory();

// ==========================================
// 🔴 SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  
  // Memory Safety Check
  Serial.println("Free Heap:");
  Serial.println(ESP.getFreeHeap());
  
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RAIN_SENSOR_PIN, INPUT);
  
  digitalWrite(RELAY1_PIN, HIGH); // OFF
  digitalWrite(RELAY2_PIN, HIGH); // OFF
  
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
  
  timeClient.begin();
  
  // API Routes
  server.on("/", handleRoot);
  server.on("/getData", handleGetData);
  server.on("/toggleRelay1", handleToggleRelay1);
  server.on("/toggleRelay2", handleToggleRelay2);
  server.on("/toggleRelay2On", []() {
      // Force ON for AI
      if (rainDetected == 0) { server.send(200, "text/plain", "BLOCKED"); return; }
      
      // Safety: High Humidity Guard
      if (humidity > 85) {
          server.send(200, "text/plain", "BLOCKED_HIGH_HUMIDITY");
          return;
      }
      
      if (!relay2State) {
          relay2State = true;
          digitalWrite(RELAY2_PIN, LOW);
          relay2StartTime = millis(); 
          addHistoryEntry("Pesticide", "ON (AI Detected)", 0, 0); 
      }
      server.send(200, "text/plain", "OK");
  });
  server.on("/setTimer", handleSetTimer);
  server.on("/setAutonomous", handleSetAutonomous); // Used for Predictive Mode
  server.on("/setPesticideAuto", handleSetPesticideAuto);
  server.on("/setPlantType", handleSetPlantType);
  server.on("/getHistory", handleGetHistory);
  server.on("/clearHistory", handleClearHistory);
  
  server.begin();
  getWeatherData();
}

// ==========================================
// 🔴 MAIN LOOP
// ==========================================
void loop() {
  server.handleClient();
  timeClient.update();
  
  static unsigned long lastRead = 0;
  if (millis() - lastRead > 2000) {
    readSensors();
    checkRainSafety();
    
    // 1. Water Logic (Priority: Rain > Timer > Predictive)
    if (predictiveModeEnabled && !relay1TimerEnabled) {
      checkPredictiveMode();
    }
    
    // 2. Pesticide Logic
    checkPesticideAutoMode();
    
    lastRead = millis();
  }
  
  // 3. Timer Logic
  if (relay1TimerEnabled && !predictiveModeEnabled) {
    checkRelay1Timer();
  }
  
  // Weather Update
  static unsigned long lastWeather = 0;
  if (millis() - lastWeather > 600000) {
    getWeatherData();
    lastWeather = millis();
  }
}

// ==========================================
// 🔴 LOGIC IMPLEMENTATIONS
// ==========================================

void readSensors() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  soilMoisture = analogRead(SOIL_MOISTURE_PIN);
  rainDetected = digitalRead(RAIN_SENSOR_PIN);
}

void checkRainSafety() {
  if (rainDetected == 0 && !previousRainState) { 
    Serial.println("🌧️ RAIN DETECTED! Emergency Stop.");
    if (relay1State) addHistoryEntry("Water Pump", "OFF (Rain)", 0, 0);
    if (relay2State) addHistoryEntry("Pesticide", "OFF (Rain)", 0, 0);
    
    relay1State = false;
    relay2State = false;
    digitalWrite(RELAY1_PIN, HIGH);
    digitalWrite(RELAY2_PIN, HIGH);
    previousRainState = true;
  } else if (rainDetected == 1 && previousRainState) {
    previousRainState = false;
  }
}

void checkPredictiveMode() {
  if (rainDetected == 0) return; 
  int threshold = isIndoorPlant ? 2500 : soilMoistureThreshold;
  
  if (soilMoisture > threshold && !relay1State) {
    relay1State = true;
    digitalWrite(RELAY1_PIN, LOW);
    relay1StartTime = millis();
    addHistoryEntry("Water Pump", "ON (Predictive)", 0, 0);
  } 
  else if (soilMoisture <= (threshold - 500) && relay1State) {
    relay1State = false;
    digitalWrite(RELAY1_PIN, HIGH);
    unsigned long duration = (millis() - relay1StartTime) / 1000;
    float amount = duration * FLOW_RATE_ML_PER_SEC;
    totalWaterUsed += amount;
    addHistoryEntry("Water Pump", "OFF (Predictive)", duration, amount);
  }
}

void checkPesticideAutoMode() {
  // Safety Timeout
  if (relay2State && (millis() - relay2StartTime > MAX_PESTICIDE_DURATION)) {
    relay2State = false;
    digitalWrite(RELAY2_PIN, HIGH);
    unsigned long duration = (millis() - relay2StartTime) / 1000;
    float amount = duration * FLOW_RATE_ML_PER_SEC;
    totalPesticideUsed += amount;
    addHistoryEntry("Pesticide", "OFF (Safety Timeout)", duration, amount);
    lastPesticideRunTime = millis();
    return;
  }

  if (pesticideAutoEnabled && rainDetected == 1) {
    if (humidity > 75 && !relay2State && (millis() - lastPesticideRunTime > PESTICIDE_COOLDOWN)) {
      relay2State = true;
      digitalWrite(RELAY2_PIN, LOW);
      relay2StartTime = millis();
      addHistoryEntry("Pesticide", "ON (High Humidity)", 0, 0);
    }
    else if (humidity < 65 && relay2State) {
      relay2State = false;
      digitalWrite(RELAY2_PIN, HIGH);
      unsigned long duration = (millis() - relay2StartTime) / 1000;
      float amount = duration * FLOW_RATE_ML_PER_SEC;
      totalPesticideUsed += amount;
      addHistoryEntry("Pesticide", "OFF (Humidity Normal)", duration, amount);
      lastPesticideRunTime = millis();
    }
  }
}

void checkRelay1Timer() {
  if (rainDetected == 0) return;
  int h = timeClient.getHours();
  int m = timeClient.getMinutes();
  
  if (h == relay1OnHour && m == relay1OnMinute && !relay1State) {
    relay1State = true;
    digitalWrite(RELAY1_PIN, LOW);
    relay1StartTime = millis();
    addHistoryEntry("Water Pump", "ON (Timer)", 0, 0);
  }
  
  if (h == relay1OffHour && m == relay1OffMinute && relay1State) {
    relay1State = false;
    digitalWrite(RELAY1_PIN, HIGH);
    unsigned long duration = (millis() - relay1StartTime) / 1000;
    float amount = duration * FLOW_RATE_ML_PER_SEC;
    totalWaterUsed += amount;
    addHistoryEntry("Water Pump", "OFF (Timer)", duration, amount);
  }
}

void getWeatherData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://api.openweathermap.org/data/2.5/weather?q=" + String(city) + "," + String(countryCode) + "&appid=" + String(weatherApiKey) + "&units=metric";
    http.begin(url);
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      StaticJsonDocument<1024> doc;
      deserializeJson(doc, payload);
      weatherTemp = doc["main"]["temp"];
      weatherHumidity = doc["main"]["humidity"];
      weatherDescription = doc["weather"][0]["description"].as<String>();
    }
    http.end();
  }
}

void addHistoryEntry(String pumpType, String action, float duration, float amount) {
  String ts = timeClient.getFormattedTime();
  for (int i = MAX_HISTORY - 1; i > 0; i--) history[i] = history[i - 1];
  history[0] = {ts, pumpType, action, duration, amount};
  if (historyCount < MAX_HISTORY) historyCount++;
}

// ==========================================
// 🔴 HANDLER IMPLEMENTATIONS
// ==========================================

void handleGetData() {
  int soilPercent = map(constrain(soilMoisture, 0, 4095), 4095, 0, 0, 100);
  int comfort = 100;
  if(soilPercent < 30) comfort -= 30;
  if(temperature > 32) comfort -= 30;
  
  String json = "{";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"soilPercent\":" + String(soilPercent) + ",";
  json += "\"rain\":" + String(rainDetected == 0 ? 1 : 0) + ",";
  json += "\"relay1\":" + String(relay1State ? 1 : 0) + ",";
  json += "\"relay2\":" + String(relay2State ? 1 : 0) + ",";
  
  // Status Flags
  json += "\"predictiveMode\":" + String(predictiveModeEnabled ? "true" : "false") + ",";
  json += "\"pesticideAuto\":" + String(pesticideAutoEnabled ? "true" : "false") + ",";
  json += "\"timerEnabled\":" + String(relay1TimerEnabled ? "true" : "false") + ",";
  json += "\"isIndoorPlant\":" + String(isIndoorPlant ? "true" : "false") + ",";
  
  // Extra Data for UI
  json += "\"comfort\":" + String(comfort) + ",";
  json += "\"totalWater\":" + String(totalWaterUsed) + ",";
  json += "\"totalPesticide\":" + String(totalPesticideUsed) + ",";
  
  // Weather Data
  json += "\"weatherDesc\":\"" + weatherDescription + "\",";
  json += "\"weatherTemp\":" + String(weatherTemp) + ",";
  json += "\"weatherHumidity\":" + String(weatherHumidity);
  
  json += "}";
  server.send(200, "application/json", json);
}

void handleSetTimer() {
  if (server.hasArg("enabled")) {
    relay1TimerEnabled = server.arg("enabled") == "true";
    if (relay1TimerEnabled) predictiveModeEnabled = false;
  }
  if (server.hasArg("on")) {
    relay1OnHour = server.arg("on").substring(0, 2).toInt();
    relay1OnMinute = server.arg("on").substring(3, 5).toInt();
  }
  if (server.hasArg("off")) {
    relay1OffHour = server.arg("off").substring(0, 2).toInt();
    relay1OffMinute = server.arg("off").substring(3, 5).toInt();
  }
  server.send(200, "text/plain", "OK");
}

void handleSetAutonomous() {
  if (server.hasArg("enabled")) {
    predictiveModeEnabled = server.arg("enabled") == "true";
    if (predictiveModeEnabled) relay1TimerEnabled = false;
  }
  server.send(200, "text/plain", "OK");
}

void handleSetPesticideAuto() {
  if (server.hasArg("enabled")) pesticideAutoEnabled = server.arg("enabled") == "true";
  server.send(200, "text/plain", "OK");
}

void handleToggleRelay1() {
  if (rainDetected == 0) { server.send(200, "text/plain", "BLOCKED"); return; }
  relay1State = !relay1State;
  digitalWrite(RELAY1_PIN, relay1State ? LOW : HIGH);
  if (relay1State) { 
    relay1StartTime = millis(); 
    addHistoryEntry("Water Pump", "ON (Manual)", 0, 0); 
  }
  else { 
    unsigned long duration = (millis() - relay1StartTime) / 1000;
    float amount = duration * FLOW_RATE_ML_PER_SEC;
    totalWaterUsed += amount;
    addHistoryEntry("Water Pump", "OFF (Manual)", duration, amount); 
  }
  server.send(200, "text/plain", "OK");
}

void handleToggleRelay2() {
  if (rainDetected == 0) { server.send(200, "text/plain", "BLOCKED"); return; }
  relay2State = !relay2State;
  digitalWrite(RELAY2_PIN, relay2State ? LOW : HIGH);
  if (relay2State) { 
    relay2StartTime = millis(); 
    addHistoryEntry("Pesticide", "ON (Manual)", 0, 0); 
  }
  else { 
    unsigned long duration = (millis() - relay2StartTime) / 1000;
    float amount = duration * FLOW_RATE_ML_PER_SEC;
    totalPesticideUsed += amount;
    addHistoryEntry("Pesticide", "OFF (Manual)", duration, amount); 
  }
  server.send(200, "text/plain", "OK");
}

void handleSetPlantType() { if (server.hasArg("type")) isIndoorPlant = server.arg("type") == "indoor"; server.send(200, "text/plain", "OK"); }

void handleGetHistory() {
  String json = "{\"history\":[";
  for (int i = 0; i < historyCount; i++) {
    if (i > 0) json += ",";
    json += "{\"timestamp\":\"" + history[i].timestamp + "\",\"pumpType\":\"" + history[i].pumpType + "\",\"action\":\"" + history[i].action + "\",\"duration\":" + String(history[i].duration) + ",\"amountUsed\":" + String(history[i].amountUsed) + "}";
  }
  json += "]}";
  server.send(200, "application/json", json);
}

void handleClearHistory() { historyCount = 0; totalWaterUsed = 0; totalPesticideUsed = 0; server.send(200, "text/plain", "OK"); }

// ==========================================
// 🔴 UI / HTML
// ==========================================
void handleRoot() {
   String html = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Growlify Guardian - AI Powered</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg-main:#F5F5DC;--primary-green:#2E7D32;--primary-green-light:#4CAF50;--text-dark:#2D3436;--text-muted:#636E72;--status-good:#27AE60;--status-warning:#E67E22;--status-critical:#E74C3C}
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:var(--bg-main);color:var(--text-dark)}
    .header-section{background:var(--bg-main);padding:25px 0 15px;border-bottom:1px solid rgba(0,0,0,0.05)}
    .main-title{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:600;font-style:italic;color:var(--primary-green);margin:0}
    .tagline{font-size:0.95rem;color:var(--primary-green);opacity:0.8;margin-top:3px}
    .mode-toggle-btn{display:inline-flex;background:#E0E0D0;border-radius:8px;padding:4px}
    .mode-btn{padding:8px 22px;border:none;background:transparent;color:var(--text-muted);font-weight:500;font-size:0.9rem;border-radius:6px;transition:all 0.3s;cursor:pointer}
    .mode-btn.indoor-active{background:linear-gradient(135deg,#8B4513,#A0522D);color:#fff;box-shadow:0 2px 8px rgba(139,69,19,0.3)}
    .mode-btn.outdoor-active{background:linear-gradient(135deg,#2E7D32,#43A047);color:#fff;box-shadow:0 2px 8px rgba(46,125,50,0.3)}
    .main-content{padding:25px 0}
    .monitoring-card{border-radius:12px;padding:18px 20px;box-shadow:0 3px 12px rgba(0,0,0,0.08);transition:all 0.3s;height:100%}
    .monitoring-card:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,0.12)}
    .soil-card{background:linear-gradient(135deg,#FFF8E1,#FFECB3);border-left:4px solid #8B4513}
    .temp-card{background:linear-gradient(135deg,#FFEBEE,#FFCDD2);border-left:4px solid #E74C3C}
    .humidity-card{background:linear-gradient(135deg,#E3F2FD,#BBDEFB);border-left:4px solid #2196F3}
    .weather-card{background:linear-gradient(135deg,#FFF3E0,#FFE0B2);border-left:4px solid #FF9800}
    .card-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .card-label{font-size:0.85rem;font-weight:600;color:var(--text-dark)}
    .card-icon-small{font-size:1.1rem;color:var(--text-muted)}
    .card-value{font-size:2rem;font-weight:700;margin-bottom:6px}
    .card-value.weather-text{font-size:1.4rem}
    .card-status{font-size:0.8rem;font-weight:500}
    .emotion-card{background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border-radius:12px;padding:16px 20px;box-shadow:0 3px 12px rgba(0,0,0,0.08);border-left:4px solid var(--primary-green)}
    .emotion-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,0.08)}
    .emotion-header i{font-size:1.3rem;color:var(--primary-green)}.emotion-header h3{font-size:1rem;font-weight:600;margin:0}
    .emotion-body{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    .comfort-score{font-size:2.2rem;font-weight:700;color:var(--primary-green)}
    .emotion-emoji{font-size:2.2rem;display:block;animation:gentle-bounce 3s ease-in-out infinite}
    @keyframes gentle-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    .emotion-bar{height:6px;background:rgba(255,255,255,0.6);border-radius:10px;overflow:hidden}
    .emotion-progress{height:100%;background:linear-gradient(90deg,var(--primary-green),var(--primary-green-light));border-radius:10px;transition:width 0.5s}
    .control-card{background:linear-gradient(135deg,#FAFAFA,#F5F5F5);border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,0.08);overflow:hidden;height:100%; margin-bottom: 20px;}
    .control-header{background:linear-gradient(135deg,#2E7D32,#43A047);padding:16px 20px;display:flex;align-items:center;gap:10px}
    .control-header.pesticide-header{background:linear-gradient(135deg,#7B1FA2,#9C27B0)}
    .control-header.ai-header{background:linear-gradient(135deg,#2980b9,#3498db)}
    .control-header i{font-size:1.2rem;color:#fff}.control-header h3{font-size:1rem;font-weight:600;color:#fff;margin:0}
    .control-body{padding:16px}
    .control-item{display:flex;align-items:center;justify-content:space-between;padding:14px;background:linear-gradient(135deg,#FFF,#F8F9FA);border-radius:8px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.04)}
    .control-info{display:flex;align-items:flex-start;gap:10px}
    .control-icon{font-size:1.2rem}
    .control-info h4{font-size:0.9rem;font-weight:600;margin-bottom:2px}
    .control-info p{font-size:0.75rem;color:var(--text-muted);margin:0}
    .form-check-input{width:42px;height:21px;cursor:pointer}
    .auto-settings{padding:14px;background:linear-gradient(135deg,rgba(46,125,50,0.1),rgba(76,175,80,0.05));border-radius:8px;margin-bottom:10px;border:1px dashed var(--primary-green)}
    .btn-set-now{background:linear-gradient(135deg,var(--primary-green),var(--primary-green-light));color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:600;font-size:0.85rem}
    .manual-controls{display:flex;align-items:center}
    .toggle-switch-container{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#E8E8E0,#D5D5C8);padding:5px 10px;border-radius:20px}
    .toggle-label{font-size:0.7rem;font-weight:600;color:var(--text-muted)}
    .manual-toggle{width:38px!important;height:19px!important}
    .manual-toggle:checked{background-color:var(--status-good)!important;border-color:var(--status-good)!important}
    .safety-notice{display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,rgba(230,126,34,0.12),rgba(230,126,34,0.06));border-radius:8px;border-left:3px solid var(--status-warning)}
    .safety-notice i{font-size:1rem;color:var(--status-warning)}.safety-notice span{font-size:0.75rem;color:var(--text-dark)}
    
    /* AI Card Styles */
    .ai-upload-area { border: 2px dashed #3498db; border-radius: 8px; padding: 20px; text-align: center; background: #f0f8ff; transition: all 0.3s; cursor: pointer; }
    .ai-upload-area:hover { background: #e1f0fa; border-color: #2980b9; }
    .ai-result-box { margin-top: 15px; padding: 15px; border-radius: 8px; background: #fff; border: 1px solid #e0e0e0; font-size: 0.9rem;  }
    .btn-analyze { background: linear-gradient(135deg, #2980b9, #3498db); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin-top: 10px; width: 100%; }
    .btn-analyze:disabled { background: #ccc; cursor: not-allowed; }
    #imagePreview { max-width: 100%; max-height: 200px; border-radius: 8px; margin-top: 10px; display: none; }
    
    .table-card{background:linear-gradient(135deg,#FFFFFF,#F8FFF8);border-radius:0 0 12px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);overflow:hidden;border:1px solid rgba(46,125,50,0.15)}
    .history-table{margin:0;border-collapse:separate;border-spacing:0}
    .history-table thead{background:linear-gradient(135deg,#1B5E20,#2E7D32)}
    .history-table thead th{color:#FFF!important;font-weight:700;font-size:0.85rem;padding:14px 16px;border:none;text-transform:uppercase;letter-spacing:0.5px;text-align:center}
    .history-table tbody td{padding:14px 16px;vertical-align:middle;border-bottom:1px solid rgba(46,125,50,0.1);font-size:0.9rem;text-align:center;color:#2D3436}
    .history-table tbody tr:nth-child(even){background:linear-gradient(135deg,#F1F8E9,#DCEDC8)}
    .pump-water{color:#0277BD;font-weight:600}.pump-pesticide{color:#7B1FA2;font-weight:600}
    .action-on{color:#2E7D32;font-weight:500}.action-off{color:#C62828;font-weight:500}
    .footer-section{background:var(--bg-main);padding:16px 0;border-top:1px solid rgba(0,0,0,0.08);margin-top:30px}
    .rain-warning{background:linear-gradient(135deg,#FFEBEE,#FFCDD2);border:2px solid #E74C3C;padding:15px;border-radius:10px;text-align:center;margin-bottom:20px}
    .rain-warning i{font-size:2rem;color:#E74C3C}
    .no-history{text-align:center;padding:30px;color:#636E72;font-style:italic}
  </style>
</head>
<body>
  <header class="header-section">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-8 col-md-7">
          <div class="d-flex align-items-center gap-3 mb-1">
            <img src="https://cdn-icons-png.flaticon.com/512/628/628283.png" alt="Logo" style="width:48px;height:48px;border-radius:50%;background:#fff;padding:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15)">
            <h1 class="main-title m-0">Growlify Guardian</h1>
            <span class="badge ms-2 live-badge" style="color:#E74C3C;font-weight:600;animation:livePulse 2s ease-in-out infinite">🔴 LIVE</span>
            <style>@keyframes livePulse{0%,100%{opacity:1}50%{opacity:0.6}}</style>
          </div>
          <p class="tagline">Smart Urban Garden Monitoring & Automation System</p>
        </div>
        <div class="col-lg-4 col-md-5 text-md-end text-center mt-2 mt-md-0">
          <div class="mode-toggle-btn">
            <button class="btn mode-btn outdoor-active" id="outdoorBtn" onclick="setMode('outdoor')">Outdoor</button>
            <button class="btn mode-btn" id="indoorBtn" onclick="setMode('indoor')">Indoor</button>
          </div>
          <p class="text-muted small mt-2 mb-0">Mode: <strong id="currentModeText">Outdoor</strong></p>
        </div>
      </div>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      <div class="rain-warning" id="rainWarning" style="display:none;">
        <i class="bi bi-cloud-rain-heavy-fill"></i>
        <h4>🌧️ Rain Detected!</h4>
        <p class="mb-0">Motors automatically disabled for safety</p>
      </div>

      <!-- Sensor Cards -->
      <section class="mb-4">
        <div class="row g-3">
          <div class="col-lg-3 col-md-6">
            <div class="monitoring-card soil-card">
              <div class="card-header-row"><span class="card-label">Soil Moisture</span><i class="bi bi-moisture card-icon-small"></i></div>
              <div class="card-value warning" id="soilValue">--<span class="value-unit">%</span></div>
              <div class="card-status" id="soilStatus">Loading...</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="monitoring-card temp-card">
              <div class="card-header-row"><span class="card-label">Temperature</span><i class="bi bi-thermometer-half card-icon-small"></i></div>
              <div class="card-value" id="tempValue">--<span class="value-unit">°C</span></div>
              <div class="card-status" id="tempStatus">Loading...</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="monitoring-card humidity-card">
              <div class="card-header-row"><span class="card-label">Humidity</span><i class="bi bi-droplet-half card-icon-small"></i></div>
              <div class="card-value" id="humidityValue">--<span class="value-unit">%</span></div>
              <div class="card-status" id="humidityStatus">Loading...</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="monitoring-card weather-card">
              <div class="card-header-row"><span class="card-label">Coimbatore Weather</span><i class="bi bi-sun card-icon-small" id="weatherIcon"></i></div>
              <div class="card-value weather-text" id="weatherValue">--</div>
              <div class="card-status" id="weatherStatus" style="color:var(--status-good)">Loading...</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Plant Emotion -->
      <section class="mb-4">
        <div class="row g-3">
          <div class="col-12">
            <div class="emotion-card">
              <div class="emotion-header"><i class="bi bi-flower1"></i><h3>🌱 Plant Health Score</h3></div>
              <div class="emotion-body">
                <div class="emotion-left">
                  <div class="comfort-score" id="comfortValue">--</div>
                  <div class="comfort-label">Comfort Score</div>
                </div>
                <div class="emotion-right text-center">
                  <div class="emotion-emoji" id="emotionEmoji">🌿</div>
                  <div class="emotion-status" id="emotionStatus">Loading...</div>
                </div>
              </div>
              <div class="emotion-bar"><div class="emotion-progress" id="emotionProgress" style="width:50%"></div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Control Systems & AI -->
      <section class="mb-4">
        <div class="row g-3">
          <!-- Water -->
          <div class="col-lg-4">
            <div class="control-card">
              <div class="control-header"><i class="bi bi-droplet-half"></i><h3>💧 Irrigation</h3></div>
              <div class="control-body">
                <div class="control-item">
                  <div class="control-info"><span class="control-icon">🧠</span><div><h4>Predictive</h4><p>Auto Soil Moisture</p></div></div>
                  <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="predictiveToggle" onchange="togglePredictive()"></div>
                </div>
                <div class="control-item">
                     <div class="control-info"><span class="control-icon">⏰</span><div><h4>Timer</h4><p>Scheduled</p></div></div>
                     <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="timerToggle" onchange="toggleTimer()"></div>
                </div>
                <div class="auto-settings" id="timerSettings" style="display:none;">
                  <div class="row g-2 align-items-end">
                    <div class="col-5"><label class="form-label">ON</label><input type="time" class="form-control" id="onTime" value="06:00"></div>
                    <div class="col-5"><label class="form-label">OFF</label><input type="time" class="form-control" id="offTime" value="18:00"></div>
                    <div class="col-2"><button class="btn btn-set-now w-100" onclick="setTimer()">Ok</button></div>
                  </div>
                </div>
                <div class="control-item">
                  <div class="control-info"><span class="control-icon">✋</span><div><h4>Manual Pump</h4><p id="waterStatus">OFF</p></div></div>
                  <div class="manual-controls">
                      <div class="form-check form-switch"><input class="form-check-input manual-toggle" type="checkbox" id="manualWaterToggle" onchange="toggleWater()"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Diagnosis -->
          <div class="col-lg-4">
            <div class="control-card">
              <div class="control-header ai-header"><i class="bi bi-stars"></i><h3>🤖 AI Disease Doctor</h3></div>
              <div class="control-body">
                <div class="ai-upload-area" onclick="document.getElementById('plantImage').click()">
                  <i class="bi bi-camera" style="font-size: 2rem; color: #3498db;"></i>
                  <p class="mb-0 mt-2 text-muted">Click to Upload Plant Photo</p>
                  <input type="file" id="plantImage" accept="image/*" style="display:none" onchange="previewImage(this)">
                </div>
                <img id="imagePreview" alt="Plant Preview" />
                <button class="btn btn-analyze" id="analyzeBtn" onclick="analyzeImage()" disabled>Analyze Image</button>
                <div class="ai-result-box" id="aiResult" style="display:none;">
                  <strong style="color:#2c3e50">Diagnosis:</strong> <span id="diagnosisText">--</span><br>
                  <strong style="color:#2c3e50">Cure:</strong> <span id="cureText">--</span>
                </div>
                <div class="mt-2 text-center" id="sprayConfirmBox" style="display:none;">
                  <p class="mb-2 fw-semibold" style="font-size:0.9rem">⚠️ Disease Detected! Kindly spray pesticide.</p>
                  <button class="btn btn-danger btn-sm me-2" onclick="confirmSpray(true)">YES</button>
                  <button class="btn btn-secondary btn-sm" onclick="confirmSpray(false)">NO</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pesticide -->
          <div class="col-lg-4">
            <div class="control-card">
              <div class="control-header pesticide-header"><i class="bi bi-shield-check"></i><h3>🧪 Pesticide</h3></div>
              <div class="control-body">
                <div class="control-item">
                  <div class="control-info"><span class="control-icon">🛡️</span><div><h4>Auto Protect</h4><p>High Humidity >75%</p></div></div>
                  <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="autoPesticideToggle" onchange="togglePesticideAuto()"></div>
                </div>
                <div class="control-item">
                  <div class="control-info"><span class="control-icon">✋</span><div><h4>Manual Spray</h4><p id="pesticideStatus">OFF</p></div></div>
                  <div class="manual-controls">
                      <div class="form-check form-switch"><input class="form-check-input manual-toggle" type="checkbox" id="manualSprayToggle" onchange="togglePesticide()"></div>
                  </div>
                </div>
                <div class="safety-notice"><i class="bi bi-exclamation-triangle-fill"></i><span>Disable if Rain detected</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Stats -->
      <section class="mb-4">
        <div class="row g-3">
          <div class="col-md-6">
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#E3F2FD,#BBDEFB);border-radius:12px;">
              <h5>💧 Total Water Used</h5>
              <div style="font-size:2rem;font-weight:700;color:#0288D1" id="totalWater">0 ml</div>
            </div>
          </div>
          <div class="col-md-6">
            <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#F3E5F5,#E1BEE7);border-radius:12px;">
              <h5>🧪 Total Pesticide Used</h5>
              <div style="font-size:2rem;font-weight:700;color:#7B1FA2" id="totalPesticide">0 ml</div>
            </div>
          </div>
        </div>
      </section>

      <!-- History -->
      <section class="mb-4">
        <div style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:12px 20px;border-radius:8px 8px 0 0;color:white;font-weight:600"><i class="bi bi-clock-history"></i> Activity History</div>
        <div class="table-card">
          <div class="table-responsive">
            <table class="table history-table">
              <thead><tr><th>#</th><th>Time</th><th>Pump</th><th>Action</th><th>Dur</th><th>Amt</th></tr></thead>
              <tbody id="historyTableBody"><tr><td colspan="6" class="no-history">No history yet</td></tr></tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="footer-section">
    <div class="container text-center">
        <i class="bi bi-flower1" style="color:#4CAF50;font-size:1.5rem;"></i>
        <p class="footer-text mt-2">Growlify Guardian – Urban Farming AI</p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    let currentMode = 'outdoor';
    
    // ================= AI LOGIC =================
    function previewImage(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('imagePreview').style.display = 'block';
          document.getElementById('imagePreview').src = e.target.result;
          document.getElementById('analyzeBtn').disabled = false;
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
    
    let detectedDisease = null;

    async function analyzeImage() {
      const fileInput = document.getElementById("plantImage");
      const btn = document.getElementById("analyzeBtn");
      const resBox = document.getElementById('aiResult');
      const confirmBox = document.getElementById('sprayConfirmBox');

      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Analyzing...';
      btn.disabled = true;
      resBox.style.display = 'none';
      confirmBox.style.display = 'none';

      try {
        const formData = new FormData();
        formData.append("img", fileInput.files[0]);

        // Timeout to prevent UI freeze
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch("http://10.195.131.154:5000/predict", {

          method: "POST",
          body: formData,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
           throw new Error("Server error");
        }

        const data = await response.json();

        console.log(data);   // DEBUG (VERY IMPORTANT)

        resBox.style.display = 'block';

        if (data.error) {
           document.getElementById("diagnosisText").innerText = data.error;
           document.getElementById("cureText").innerText = "";
           return;
        }

        document.getElementById("diagnosisText").innerText = data.disease + " (" + data.confidence + "%)";
        document.getElementById("cureText").innerText = data.cure;

        // Store for spray confirmation
        detectedDisease = { name: data.disease, cure: data.cure };

        // Rain safety: Don't show spray prompt if rain detected
        const rainVisible = window.getComputedStyle(document.getElementById("rainWarning")).display === "block";

        if (data.spray_required && !rainVisible) {
           confirmBox.style.display = 'block';
        }

      } catch (error) {
        resBox.style.display = 'block';
        document.getElementById("diagnosisText").innerText = "Error: Could not connect to AI server";
        document.getElementById("cureText").innerText = "Make sure Flask backend is running on port 5000";
      }

      btn.innerHTML = 'Analyze Image';
      btn.disabled = false;
    }

    function confirmSpray(choice) {
      document.getElementById('sprayConfirmBox').style.display = 'none';

      if (choice) {
        fetch('/toggleRelay2On')
          .then(() => {
            alert("✅ Pesticide started (auto OFF in 10 seconds)");
            updateData();
          });
      } else {
        alert("❌ Pesticide cancelled");
      }
    }

    function resizeImage(file, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality jpeg
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }

    // ================= EXISTING LOGIC =================
    
    function updateData() {
      fetch('/getData').then(r => r.json()).then(data => {
        // Soil
        const soilEl = document.getElementById('soilValue');
        soilEl.innerHTML = data.soilPercent + '<span class="value-unit">%</span>';
        soilEl.className = 'card-value ' + (data.soilPercent < 30 ? 'critical' : data.soilPercent > 70 ? 'warning' : 'good');
        document.getElementById('soilStatus').textContent = data.soilPercent < 30 ? 'Dry' : data.soilPercent > 70 ? 'Moist' : 'Good';
        
        // Temp & Hum
        document.getElementById('tempValue').innerHTML = data.temperature.toFixed(1) + '<span class="value-unit">°C</span>';
        document.getElementById('humidityValue').innerHTML = data.humidity.toFixed(1) + '<span class="value-unit">%</span>';
        
        // Weather
        document.getElementById('weatherValue').textContent = data.weatherDesc || 'N/A';
        document.getElementById('weatherStatus').textContent = data.weatherTemp.toFixed(1) + '°C';
        
        document.getElementById('rainWarning').style.display = (data.rain == 1) ? 'block' : 'none';

        // Comfort
        document.getElementById('comfortValue').textContent = data.comfort;
        document.getElementById('emotionProgress').style.width = data.comfort + '%';
        const emoji = data.comfort >= 80 ? '😊' : data.comfort >= 50 ? '😐' : '😟';
        document.getElementById('emotionEmoji').textContent = emoji;
        document.getElementById('emotionStatus').textContent = data.comfort >= 80 ? 'Healthy!' : data.comfort >= 50 ? 'Fair' : 'Poor';
        
        // Toggles
        document.getElementById('predictiveToggle').checked = data.predictiveMode === true;
        document.getElementById('timerToggle').checked = data.timerEnabled === true;
        document.getElementById('autoPesticideToggle').checked = data.pesticideAuto === true;
        document.getElementById('manualWaterToggle').checked = (data.relay1 == 1);
        document.getElementById('manualSprayToggle').checked = (data.relay2 == 1);
        
        document.getElementById('timerSettings').style.display = data.timerEnabled ? 'block' : 'none';
        
        // Status Text
        document.getElementById('waterStatus').textContent = (data.relay1 == 1 ? 'ON' : 'OFF');
        document.getElementById('pesticideStatus').textContent = (data.relay2 == 1 ? 'ON' : 'OFF');
        
        // Totals
        document.getElementById('totalWater').textContent = Math.round(data.totalWater) + ' ml';
        document.getElementById('totalPesticide').textContent = Math.round(data.totalPesticide) + ' ml';
        
        if(data.isIndoorPlant) setModeUI('indoor'); else setModeUI('outdoor');
      });
    }
    
    function refreshHistory() {
      fetch('/getHistory').then(r => r.json()).then(data => {
        const tbody = document.getElementById('historyTableBody');
        if (!data.history || data.history.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="no-history">No history yet</td></tr>';
        } else {
          tbody.innerHTML = data.history.map((e, index) => {
            const pumpClass = e.pumpType.includes('Water') ? 'pump-water' : 'pump-pesticide';
            const actionClass = e.action.includes('ON') ? 'action-on' : 'action-off';
            return '<tr>' +
              '<td>' + (index + 1) + '</td>' +
              '<td>' + e.timestamp + '</td>' +
              '<td class="' + pumpClass + '">' + e.pumpType + '</td>' +
              '<td class="' + actionClass + '">' + e.action + '</td>' +
              '<td>' + e.duration + 's</td>' +
              '<td>' + Math.round(e.amountUsed) + ' ml</td>' +
            '</tr>';
          }).join('');
        }
      });
    }
    
    function togglePredictive() { fetch('/setAutonomous?enabled=' + document.getElementById('predictiveToggle').checked).then(() => setTimeout(updateData, 300)); }
    function toggleTimer() { fetch('/setTimer?enabled=' + document.getElementById('timerToggle').checked).then(() => setTimeout(updateData, 300)); }
    function togglePesticideAuto() { fetch('/setPesticideAuto?enabled=' + document.getElementById('autoPesticideToggle').checked).then(() => setTimeout(updateData, 300)); }
    function toggleWater() { fetch('/toggleRelay1').then(() => setTimeout(updateData, 300)); }
    function togglePesticide() { fetch('/toggleRelay2').then(() => setTimeout(updateData, 300)); }
    
    function setTimer() {
      fetch('/setTimer?enabled=true&on=' + document.getElementById('onTime').value + '&off=' + document.getElementById('offTime').value)
        .then(() => { alert('Schedule Saved'); updateData(); });
    }
    
    function setMode(mode) { setModeUI(mode); fetch('/setPlantType?type=' + mode); }
    function setModeUI(mode) {
       currentMode = mode;
       document.getElementById('indoorBtn').classList.remove('indoor-active', 'outdoor-active');
       document.getElementById('outdoorBtn').classList.remove('indoor-active', 'outdoor-active');
       document.getElementById(mode + 'Btn').classList.add(mode + '-active');
       document.getElementById('currentModeText').textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    }
    
    setInterval(updateData, 2000);
    setInterval(refreshHistory, 5000);
    updateData();
    refreshHistory();
  </script>
</body>
</html>
)rawliteral";
  server.send(200, "text/html", html);
}
