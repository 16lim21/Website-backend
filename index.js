const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 4444;

require('./config.env').config();
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
  service: 'Gmail',
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
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
        } else {
          res.send('Success')
        }
        transporter.close();
      }
  );
})