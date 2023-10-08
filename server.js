require("dotenv").config()
const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const multer = require("multer")

const app = express()
app.use(cors())
app.use(express.json()) // Add this line to parse JSON body

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post("/send-email", upload.array("attachments"), async (req, res) => {
  console.log("Received body:", req.body)
  console.log("Received files:", req.files)

  // Handling no files uploaded case
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.")
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const attachments = req.files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
  }))

  // Ensure you have name, email, subject, and message in the request body
  const { name, email, subject, message } = req.body

  try {
    await transporter.sendMail({
      from: `"My Website" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL, // Ensure this variable is set in your .env file
      subject: subject,
      text: `From: ${name} <${email}>\n\n${message}`,
      attachments: attachments,
    })
    res.send("Email sent!")
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).send("Error sending email")
  }
})

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})
//comment