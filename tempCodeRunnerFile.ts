greate this is working:

// @ts-nocheck
import { readFile, writeFile } from 'fs/promises';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const templatePath = './public/templates/base-adgips.pdf';
const outputPath = './filled_output.pdf';

const data = {
  name: 'Avinash Jha',
  date: '2025-05-25',
  amount: '$10,000'
};

const fieldMap = {
  name: { x: 100, y: 500 },
  date: { x: 100, y: 480 },
  amount: { x: 100, y: 460 }
};

async function fillPdf(data) {
  const existingPdfBytes = await readFile(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.getPages()[0];

  for (const [key, value] of Object.entries(data)) {
    const position = fieldMap[key];
    if (position) {
      page.drawText(value, {
        x: position.x,
        y: position.y,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  await writeFile(outputPath, pdfBytes);
  console.log('✅ PDF generated:', outputPath);
}

fillPdf(data);



now there is bunch of data ilve to show here like: 