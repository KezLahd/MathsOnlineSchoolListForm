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

    // Enhanced file type logic
    function classifyFileType(ext) {
      const excelTypes = ['xlsx', 'xls', 'csv'];
      const pdfTypes = ['pdf'];
      const imageTypes = ['jpg', 'jpeg', 'png'];
      if (excelTypes.includes(ext)) return 'Excel';
      if (pdfTypes.includes(ext)) return 'PDF';
      if (imageTypes.includes(ext)) return 'Image';
      return ext;
    }

    const attachments = (req.files || []).map(file => {
      const ext = file.originalname.split('.').pop().toLowerCase() || '';
      return {
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer.toString('base64'),
        fileType: classifyFileType(ext),
        ext,
      };
    });

    const numberOfAttachments = attachments.length;

    // Grouping logic for multiple files
    let allExcel = false, allPDF = false, allImage = false;
    let excelAttachments = [], pdfAttachments = [], imageAttachments = [], otherAttachments = [];
    if (attachments.length === 1) {
      // For a single file, fileType is already set
      delete attachments[0].ext;
    } else if (attachments.length > 1) {
      attachments.forEach(att => {
        if (att.fileType === 'Excel') excelAttachments.push(att);
        else if (att.fileType === 'PDF') pdfAttachments.push(att);
        else if (att.fileType === 'Image') imageAttachments.push(att);
        else otherAttachments.push(att);
        delete att.ext;
      });
      allExcel = excelAttachments.length === attachments.length;
      allPDF = pdfAttachments.length === attachments.length;
      allImage = imageAttachments.length === attachments.length;
    }

    const body = {
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
    };
    if (attachments.length > 1) {
      if (allExcel) body.allExcel = true;
      if (allPDF) body.allPDF = true;
      if (allImage) body.allImage = true;
      if (excelAttachments.length) body.excelAttachments = excelAttachments;
      if (pdfAttachments.length) body.pdfAttachments = pdfAttachments;
      if (imageAttachments.length) body.imageAttachments = imageAttachments;
      if (otherAttachments.length) body.otherAttachments = otherAttachments;
    }

    try {
      const response = await fetch('https://kieranjackson.app.n8n.cloud/webhook-test/a1a37b15-fd78-40f7-b0a1-64576b0adf64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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