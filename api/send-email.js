const nodemailer = require("nodemailer")

module.exports = async (req, res) => {
  // Set CORS headers
   res.setHeader(
     "Access-Control-Allow-Origin",
     "https://my-new-site-nine.vercel.app"
   )
   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
   res.setHeader("Access-Control-Allow-Headers", "Content-Type")

   // Handle Preflight Request
   if (req.method === "OPTIONS") {
     return res.status(200).end()
   }

   if (req.method !== "POST") {
     return res.status(405).end() // Method Not Allowed
   }

  // Parse request body
  const { name, email, subject, message, attachments } = req.body

  // Validate request body
  if (!name || !email || !subject || !message) {
    return res.status(400).send("שדות חובה חסרים")
  }

  // Create transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Convert base64 attachments to Buffer
  const attachmentBuffers = attachments.map((att, index) => {
    // Extract file extension from MIME type
    const extension = att.type.split("/")[1] // assuming att.type is something like "image/png"

    return {
      filename: `attachment${index + 1}.${extension}`, // Now extension is defined
      content: Buffer.from(att.data, "base64"),
    }
  })


  // Send email
  try {
    await transporter.sendMail({
      from: `"My Website" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: subject,
      text: `From: ${name} <${email}>\n\n${message}`,
      attachments: attachmentBuffers,
    })
    res.status(200).send("ההודעה נשלחה!")
  } catch (error) {
    console.error("אירעה שגיאה, ההודעה לא נשלחה:", error)
    res.status(500).send("אירעה שגיאה, ההודעה לא נשלחה:")
  }
}
