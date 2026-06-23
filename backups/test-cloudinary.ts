import crypto from 'crypto';
import fs from 'fs';

async function uploadDummy() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `sust_research/test`;
  const publicId = "real_pdf_test"; 
  
  const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

  const pdfBuffer = fs.readFileSync('public/uploads/publication/39/Explainable_Multi-Threshold_Machine_Learning_Analysis_of_Depression_Among_Bangladeshi_Adolescents_An_Empirical_Study.pdf');
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const file = new File([blob], 'real_pdf.pdf', { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey!);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('resource_type', 'image');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log("Cloudinary Upload Result:", result);
}

uploadDummy().catch(console.error);
