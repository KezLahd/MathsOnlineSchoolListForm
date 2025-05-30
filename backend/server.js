const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const upload = multer();

app.use(cors());

app.post('/api/send-email', upload.array('attachments'), async (req, res) => {
  const { schoolName, schoolType, adminName, adminEmail, subscriptionMethod } = req.body;
  const attachments = (req.files || []).map(file => ({
    filename: file.originalname,
    content: file.buffer.toString('base64'),
  }));

  try {
    const response = await fetch('https://kieranjackson.app.n8n.cloud/webhook-test/a1a37b15-fd78-40f7-b0a1-64576b0adf64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolName,
        schoolType,
        adminName,
        adminEmail,
        subscriptionMethod,
        attachments,
      }),
    });

    if (response.ok) {
      res.status(200).send("Webhook sent!");
    } else {
      res.status(500).send("Failed to trigger n8n workflow.");
    }
  } catch (err) {
    res.status(500).send("Error triggering n8n workflow.");
  }
});

app.listen(3000, () => console.log('Server running on port 3000')); 