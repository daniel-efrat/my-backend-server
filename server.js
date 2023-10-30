require("dotenv").config()
const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/") // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage: storage })

// Endpoint for image upload
app.post("/upload-images", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded.")
  }
  // You can return the path or URL of the uploaded file here
  res.status(200).send({ filePath: `/uploads/${req.file.filename}` })
})

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"))

// Existing email sending endpoint
app.post("/send-email", upload.array("attachments"), async (req, res) => {
  // ... existing code for sending email ...
})

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})
