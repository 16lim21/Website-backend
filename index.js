const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(process.env.PORT || 4444, () => {
  console.log('We are live!');
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.post('/api', (req,res) => {
  console.log("received")
  var data = req.body;

  var mailOptions = {
    from: data.email,
    to: process.env.EMAIL,
    subject: `New Website Message from ${data.name}`,
    html: `<p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Message: ${data.message}</p>`
  };

  transporter.sendMail(mailOptions, 
      (error, response) => {
        if (error) {
          res.send(error)
          console.log(error)
        } else {
          res.send('Success')
        }
        transporter.close();
      }
  );
})