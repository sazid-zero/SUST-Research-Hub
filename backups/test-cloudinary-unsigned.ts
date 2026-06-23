import fs from 'fs';

async function uploadUnsigned() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const pdfBuffer = fs.readFileSync('public/uploads/publication/39/Explainable_Multi-Threshold_Machine_Learning_Analysis_of_Depression_Among_Bangladeshi_Adolescents_An_Empirical_Study.pdf');
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const file = new File([blob], 'real_pdf.pdf', { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset!);
  formData.append('folder', 'sust_research/test_unsigned');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log("Cloudinary Unsigned Upload Result:", result);
}

uploadUnsigned().catch(console.error);
