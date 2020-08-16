const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 4444;

const client_id = require('./client_id.json');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log('We are live on port 4444');
});


app.get('/', (req, res) => {
  res.send('Post to /api');
})

var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: client_id.web.client_id,
    clientSecret: client_id.web.client_secret,
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
    subject: `New Message from ${data.name}`,
    html: `<p>${data.name}</p>
            <p>${data.email}</p>
            <p>${data.message}</p>`
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