const express = require('express'); // set up Express.js server
const { Resend } = require('resend'); // import Resend for email sending (to use Resend API)
require('dotenv').config(); // load environment variables from .env file
const path = require('path'); // import path for serving static files

const app = express(); // create Express application
const resend = new Resend(process.env.RESEND_API_KEY); // initialize Resend with API key from environment variables
const cors = require('cors');

app.use(express.json()); // set the middleware to parse and process JSON requests (so Express can process JSON data sent from contact form submission)
app.use(express.static(path.join(__dirname, '../')));
app.use(cors());

app.post('/api/contact', async (req, res) => { // handle POST requests to /api/contact endpoint
  const { name, email, subject, message, number } = req.body; // req.body contains the data sent from the contact form in the given variables (name, email, subject, message, number)

  try { // try to send an email using Resend
    await resend.emails.send({ // send an email using Resend API
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.TO_EMAIL, // your Gmail address
      subject: `Portfolio Message: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <p><strong>Number:</strong> ${number}</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 3000; // set the port for the server to listen on, defaulting to 3000 if not specified in environment variables (specified port OR PORT 3000)
app.listen(PORT, () => { // start the server and listen on the specified port
  console.log(`Server running at http://localhost:${PORT}`); // print console message indicating the server is running and the URL to access it
});
