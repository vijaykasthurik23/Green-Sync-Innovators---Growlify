function calculateWaterReminder(
  plantWaterNeed,
  location,
  temperature,
  isRaining
) {
  // Rule 1: Base water amount by plant nature (litres)
  let water = 0;

  if (plantWaterNeed === "low") water = 0.4;
  if (plantWaterNeed === "medium") water = 0.8;
  if (plantWaterNeed === "high") water = 1.2;

  // Rule 2: Location adjustment
  if (location === "indoor") water *= 0.9;
  if (location === "outdoor") water *= 1.1;
  // balcony → no change

  // Rule 3: Temperature adjustment
  if (temperature > 35) water *= 1.2;
  if (temperature < 20) water *= 0.8;

  // Rule 4: Rain condition
  if (isRaining && location === "outdoor") {
    return {
      waterLitres: 0,
      message: "Skip watering due to rain"
    };
  }

  return {
    waterLitres: Math.round(water * 10) / 10,
    message: "Water the plant"
  };
}