import { writeFileSync } from 'node:fs';

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];

const streamText = [
  'BT /F1 24 Tf 72 700 Td (Resume Placeholder) Tj ET',
  'BT /F1 12 Tf 72 670 Td (Replace this file with your real resume PDF.) Tj ET',
].join('\n');
const streamBody = `<< /Length ${streamText.length} >>\nstream\n${streamText}\nendstream`;

const allObjects = [...objects, streamBody];

let pdf = '%PDF-1.4\n';
const offsets = [0];
allObjects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
let xref = `xref\n0 ${allObjects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= allObjects.length; i += 1) {
  xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
}

pdf += xref;
pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

writeFileSync(new URL('../public/resume-placeholder.pdf', import.meta.url), pdf, 'latin1');
console.log('Wrote public/resume-placeholder.pdf');
