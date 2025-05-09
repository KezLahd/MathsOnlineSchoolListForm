const multer = require('multer')();
const fetch = require('node-fetch');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  multer.array('attachments')(req, {}, async (err) => {
    if (err) return res.status(500).send('Upload error');
    const { schoolName, schoolType, adminName, adminFirstName, adminLastName, adminTitle, adminEmail, subscriptionMethod } = req.body;
    const attachments = (req.files || []).map(file => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer.toString('base64'), // send as base64 string for Google Drive compatibility
      fileType: file.originalname.split('.').pop() || '',
    }));

    const numberOfAttachments = attachments.length;

    try {
      const response = await fetch('https://kieranjackson.app.n8n.cloud/webhook-test/a1a37b15-fd78-40f7-b0a1-64576b0adf64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          schoolType,
          adminName,
          adminFirstName,
          adminLastName,
          adminTitle,
          adminEmail,
          subscriptionMethod,
          attachments,
          numberOfAttachments,
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
}; 