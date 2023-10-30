require("dotenv").config()
const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const app = express()
app.use(cors())
app.use(express.json())

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/") // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage: storage })

// Existing /send-email endpoint
// ...

// New /upload-image endpoint
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.")
  }

  console.log("Uploaded file:", req.file.path)
  res.send({
    message: "File uploaded successfully.",
    filePath: req.file.path,
  })
})

// Serve static files from 'uploads' directory
app.use("/uploads", express.static("uploads"))

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})
