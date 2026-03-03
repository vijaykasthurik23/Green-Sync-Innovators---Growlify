const express = require("express");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();
const logger = require("../utils/logger");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-creator-node");

// --- Import the auth middleware ---
const authMiddleware = require("../utils/authMiddleware");

// --- Import the Quotation model ---
const Quotation = require("../models/Quotation");

// --- Admin Credentials (Hardcoded as requested) ---
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@123";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// --- Multer Configuration for File Uploads ---
const uploadDir = path.join(__dirname, "../public/uploads/quotations");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    // Allow video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for video upload'), false);
    }
  } else {
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for image uploads'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max for video
  }
});

const quotationUpload = upload.fields([
  { name: 'frontViewImage', maxCount: 1 },
  { name: 'topViewImage', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Route 1: Create Razorpay Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }

  const options = {
    amount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      message: "Razorpay order created successfully.",
    });
  } catch (error) {
    logger.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ error: "Order creation failed. " + error.message });
  }
});

// Route 2: Send Order Confirmation Email
router.post("/send-confirmation", async (req, res) => {
  const { formData, cart, paymentResponse } = req.body;

  if (!formData || !cart || !paymentResponse) {
    return res.status(400).json({ error: "Missing required data." });
  }

  let totalAmount = 0;
  cart.forEach(item => {
    if (!item.comingSoon) {
      totalAmount += item.price * item.quantity;
    }
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9fdf9; padding: 20px; border-radius: 12px; max-width: 700px; margin: auto; box-shadow: 0 0 15px rgba(0,0,0,0.05); color: #333;">
      <div style="background-color: #e6f4ea; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="color: #2e7d32; margin: 0;">🌿 Growlify Essentials Order Confirmation</h2>
      </div>

      <div style="padding: 20px;">
        <p>Dear <strong>${formData.fullName}</strong>,</p>
        <p>Thank you for your recent purchase from <strong>Growlify Essentials</strong>! Your order has been successfully placed and your payment processed.</p>

        <h3 style="color: #2e7d32; margin-top: 30px;">Customer & Shipping Details:</h3>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Address:</strong> ${formData.address}, ${formData.area}, ${formData.city}, ${formData.state} - ${formData.pincode}</p>

        <h3 style="color: #2e7d32; margin-top: 30px;">🛒 Items Ordered:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #ffffff;">
          <thead style="background-color: #d1f0d4;">
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ccc;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ccc;">Option</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ccc;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ccc;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ccc;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => {
    const subtotal = item.price * item.quantity;
    return `
                <tr style="background-color: #f5fcf6;">
                  <td style="padding: 10px;">${item.name}</td>
                  <td style="padding: 10px;">${item.selectedOption || 'N/A'}</td>
                  <td style="padding: 10px; text-align: right;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 10px; text-align: right;">₹${subtotal.toFixed(2)}</td>
                </tr>
              `;
  }).join("")}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="4" style="padding: 10px; text-align: right;">Grand Total:</td>
              <td style="padding: 10px; text-align: right;">₹${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="color: #2e7d32; margin-top: 30px;">💳 Payment Details:</h3>
        <p><strong style="color: #2e7d32;">Razorpay Payment ID:</strong> ${paymentResponse.razorpay_payment_id}</p>
        <p><strong style="color: #2e7d32;">Razorpay Order ID:</strong> ${paymentResponse.razorpay_order_id}</p>
        <p><strong>Status:</strong> ✅ Payment Successful</p>

        <p style="margin-top: 20px;">We are preparing your order for shipment and will notify you once it's on its way. You can expect your gardening essentials to arrive soon!</p>
        <p>If you have any questions, feel free to reach out.</p>

        <p>Thank you again for choosing <strong>Growlify Essentials</strong> 🌱</p>

        <p style="margin-top: 30px;">Warm Regards,<br><strong>The Growlify Essentials Team</strong></p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #888; padding: 10px; border-top: 1px solid #eee;">
        © ${new Date().getFullYear()} Growlify Essentials. All rights reserved.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: `${formData.email}, ${process.env.EMAIL_USER}`,
      subject: "🌿 Your Growlify Essentials Order is Confirmed!",
      html: htmlContent,
    });

    res.status(200).json({ message: "Confirmation email sent." });
  } catch (error) {
    logger.error("❌ Email send failed:", error.message);
    res.status(500).json({ error: "Failed to send email. " + error.message });
  }
});

// ---
// ROUTE 3: Submit Quotation Request (with file uploads)
// ---
router.post("/submit-quotation", authMiddleware, quotationUpload, async (req, res) => {
  try {
    const { productId, productName, productType, email, phone, heightCm, widthCm, estimatedAmount } = req.body;
    const user = req.user;

    // Validate required fields
    if (!productId || !productName || !productType || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate dimension fields
    if (!heightCm || !widthCm || heightCm <= 0 || widthCm <= 0) {
      return res.status(400).json({ message: "Please provide valid height and width dimensions." });
    }

    if (!estimatedAmount || estimatedAmount <= 0) {
      return res.status(400).json({ message: "Invalid estimated amount." });
    }

    // Validate required files
    if (!req.files || !req.files.frontViewImage || !req.files.topViewImage) {
      return res.status(400).json({ message: "Front view and top view images are required." });
    }

    // Create quotation record
    const quotation = new Quotation({
      userId: user._id,
      userName: user.name,
      email: email,
      phone: phone,
      productId: parseInt(productId),
      productName: productName,
      productType: productType,
      frontViewImage: req.files.frontViewImage[0].filename,
      topViewImage: req.files.topViewImage[0].filename,
      videoPath: req.files.video ? req.files.video[0].filename : null,
      heightCm: parseFloat(heightCm),
      widthCm: parseFloat(widthCm),
      estimatedAmount: parseFloat(estimatedAmount),
      status: 'pending'
    });

    await quotation.save();

    logger.info(`✅ Quotation request submitted by ${email} for ${productName}`);

    // Send notification email to admin
    const adminHtmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2e7d32;">🌿 New Quotation Request</h2>
        <p>A user has submitted a new quotation request.</p>

        <h3 style="color: #2e7d32;">User Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${user.name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <h3 style="color: #2e7d32;">Product Details:</h3>
        <ul>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Type:</strong> ${productType === 'premium' ? '⭐ Premium' : '💰 Budget Friendly'}</li>
        </ul>
        
        <p style="margin-top: 20px;">Please login to the Admin Panel to review this request and approve/decline.</p>
        <p><strong>The Growlify Admin System</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🌿 New Quotation Request: ${productName}`,
      html: adminHtmlContent,
    });

    res.status(200).json({
      message: "Quotation request submitted successfully! Our team will review and get back to you soon.",
      quotationId: quotation._id
    });

  } catch (error) {
    logger.error("❌ Failed to submit quotation:", error);
    res.status(500).json({ message: "Failed to submit quotation request." });
  }
});

// ---
// ROUTE 4: Admin Login
// ---
router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    logger.info("✅ Admin login successful");
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: { email: ADMIN_EMAIL }
    });
  } else {
    logger.warn("❌ Admin login failed - invalid credentials");
    res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });
  }
});

// ---
// ROUTE 5: Get All Quotation Requests (Admin Only)
// ---
router.get("/admin/quotations", (req, res) => {
  // Simple admin check via query param or header
  const adminAuth = req.headers['x-admin-auth'];

  if (adminAuth !== 'true') {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  Quotation.find()
    .sort({ createdAt: -1 })
    .then(quotations => {
      res.status(200).json({ quotations });
    })
    .catch(error => {
      logger.error("❌ Failed to fetch quotations:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    });
});

// ---
// ROUTE 6: Approve Quotation
// ---
router.put("/admin/quotations/:id/approve", async (req, res) => {
  const adminAuth = req.headers['x-admin-auth'];

  if (adminAuth !== 'true') {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Generate PDF
    const templatePath = path.join(__dirname, "../templates/adminQuotationTemplate.html");
    const html = fs.readFileSync(templatePath, "utf8");

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };

    // Get features based on product type
    const features = quotation.productType === 'premium'
      ? [
        'Auto Irrigation + Pest Protection',
        'Sensor-Driven Smart Decisions',
        'Weather-Aware & Rain-Safe Operation',
        'Low-Chemical, Eco-Friendly Care',
        '24/7 Real-time Monitoring',
        'Advanced Pest Detection AI'
      ]
      : [
        'Automated Soil Moisture Detection',
        'Smart Scheduled Watering',
        'Water Conservation Mode',
        'Mobile App Control',
        'Weather Integration'
      ];

    // Validate amount
    const amount = req.body.amount;
    if (!amount) {
      return res.status(400).json({ message: "Quotation amount is required." });
    }

    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);

    const document = {
      html: html,
      data: {
        quotationId: quotation._id.toString().slice(-8).toUpperCase(),
        name: quotation.userName,
        email: quotation.email,
        phone: quotation.phone,
        date: new Date().toLocaleDateString('en-IN'),
        validUntil: validDate.toLocaleDateString('en-IN'),
        requestDate: new Date(quotation.createdAt).toLocaleDateString('en-IN'),
        productName: quotation.productName,
        productType: quotation.productType === 'premium'
          ? 'IoT-Powered Intelligent Garden Monitoring & Control System'
          : 'IoT-Based Auto Watering System',
        productBadge: quotation.productType === 'premium' ? 'Premium' : 'Budget Friendly',
        badgeClass: quotation.productType === 'premium' ? 'badge-premium' : 'badge-budget',
        features: features,
        estimatedPrice: formattedPrice,
        year: new Date().getFullYear(),
      },
      path: path.join(__dirname, `../temp/quotation_${quotation._id}.pdf`),
      type: "",
    };

    // Ensure temp dir exists
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const pdfResult = await pdf.create(document, options);
    const pdfPath = pdfResult.filename;

    // Update quotation status
    quotation.status = 'approved';
    quotation.quotationPdfPath = pdfPath;
    quotation.finalAmount = parseFloat(amount);
    await quotation.save();

    // Send email to user with PDF
    const userHtmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2e7d32;">Your Quotation is Ready</h2>
        <p>Dear ${quotation.userName},</p>
        <p>Thank you for your interest in <strong>${quotation.productName}</strong>!</p>
        <p>We have reviewed your garden images and prepared a customized quotation for you. Please find the detailed quotation attached to this email.</p>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin-top: 0;">What's Next?</h3>
          <ul>
            <li>Review the attached quotation</li>
            <li>Contact us if you have any questions</li>
            <li>Schedule a free consultation call</li>
          </ul>
        </div>
        
        <p>Our team is ready to help you set up your smart garden!</p>
        <p>Best regards,<br><strong>The Growlify Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: quotation.email,
      subject: `Growlify Quotation Ready - ${quotation.productName}`,
      html: userHtmlContent,
      attachments: [
        {
          filename: `Growlify_Quotation_${quotation._id.toString().slice(-8).toUpperCase()}.pdf`,
          path: pdfPath,
        },
      ],
    });

    logger.info(`✅ Quotation approved and PDF sent to ${quotation.email}`);

    // Cleanup temp PDF
    fs.unlink(pdfPath, (err) => {
      if (err) logger.warn("Failed to delete temp PDF:", err);
    });

    res.status(200).json({
      message: "Quotation approved and sent to user successfully!",
      quotation: quotation
    });

  } catch (error) {
    logger.error("❌ Failed to approve quotation:", error);
    res.status(500).json({ message: "Failed to approve quotation" });
  }
});

// ---
// ROUTE 7: Decline Quotation
// ---
router.put("/admin/quotations/:id/decline", async (req, res) => {
  const adminAuth = req.headers['x-admin-auth'];

  if (adminAuth !== 'true') {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    quotation.status = 'declined';
    quotation.adminNotes = req.body.notes || 'Quotation declined by admin';
    await quotation.save();

    // Send decline notification to user
    const userHtmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #e74c3c;">Quotation Request Update</h2>
        <p>Dear ${quotation.userName},</p>
        <p>Thank you for your interest in <strong>${quotation.productName}</strong>.</p>
        <p>After reviewing your request, we regret to inform you that we are unable to proceed with your quotation at this time.</p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Possible reasons:</strong></p>
          <ul>
            <li>Images provided were unclear or insufficient</li>
            <li>Garden area may not be suitable for this product</li>
            <li>Additional information required</li>
          </ul>
        </div>
        
        <p>Please feel free to submit a new request with clearer images or contact our support team for assistance.</p>
        <p>Best regards,<br><strong>The Growlify Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: quotation.email,
      subject: `Growlify - Quotation Request Update`,
      html: userHtmlContent,
    });

    logger.info(`❌ Quotation declined for ${quotation.email}`);

    res.status(200).json({
      message: "Quotation declined and user notified.",
      quotation: quotation
    });

  } catch (error) {
    logger.error("❌ Failed to decline quotation:", error);
    res.status(500).json({ message: "Failed to decline quotation" });
  }
});

// ---
// ROUTE 8: Get uploaded image/video (public access for admin panel)
// ---
router.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// ---
// ROUTE 9: REQUEST QUOTATION (Legacy - keeping for backward compatibility)
// ---
router.post("/request-quotation", authMiddleware, async (req, res) => {
  const { product, email, phone } = req.body;
  const user = req.user;

  if (!product || !email || !phone) {
    return res.status(400).json({ message: "Missing required data." });
  }

  logger.info(`Quotation request received for ${product.name} from ${email}`);

  // 1. Read HTML Template
  const templatePath = path.join(__dirname, "../templates/quotationTemplate.html");
  const html = fs.readFileSync(templatePath, "utf8");

  // 2. Prepare Data for PDF
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };

  const document = {
    html: html,
    data: {
      name: user ? user.name : "Valued Customer",
      email: email,
      phone: phone,
      product: product,
      date: new Date().toLocaleDateString(),
      year: new Date().getFullYear(),
    },
    path: path.join(__dirname, `../temp/quotation_${Date.now()}.pdf`),
    type: "",
  };

  // Ensure temp dir exists
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    // 3. Generate PDF
    const pdfResult = await pdf.create(document, options);
    const pdfPath = pdfResult.filename;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 600px; margin: auto; color: #333;">
        <h2 style="color: #2e7d32;">🌿 New Quotation Request</h2>
        <p>A user has requested a quotation for an upcoming product.</p>

        <h3 style="color: #2e7d32;">User Details:</h3>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <h3 style="color: #2e7d32;">Product Details:</h3>
        <ul>
          <li><strong>Product ID:</strong> ${product.id}</li>
          <li><strong>Product Name:</strong> ${product.name}</li>
          <li><strong>Type:</strong> ${product.type}</li>
          <li><strong>Details:</strong> ${product.details}</li>
        </ul>
        
        <p style="margin-top: 20px;">Please find the official quotation attached as a PDF.</p>
        <p><strong>The Growlify Admin Team</strong></p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin
      cc: email, // CC the user
      subject: `Quotation Request: ${product.name}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Quotation_${product.name.replace(/\s+/g, '_')}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Quotation email with PDF sent successfully to ${email}.`);

    // Cleanup: Delete the temp PDF file
    fs.unlink(pdfPath, (err) => {
      if (err) logger.warn("Failed to delete temp PDF:", err);
    });

    res.status(200).json({ message: "Quotation request sent successfully!" });

  } catch (error) {
    logger.error("❌ Failed to generate PDF or send quotation email:", error);
    res.status(500).json({ message: "Failed to send quotation request." });
  }
});

module.exports = router;