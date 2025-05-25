import fontkit from '@pdf-lib/fontkit';
import { readFile, writeFile } from 'fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';

const templatePath = './public/templates/base-adgips.pdf';
const outputPath = './filled_output.pdf';
const fontPath = './public/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf'; // path to your .ttf

const meta = {
  title: 'LAB MANUAL',
  subtitle: 'B. Tech - 7ᵗʰ Semester'
};

const data = {
  Name: 'Avinash Jha',
  Date: '2025-05-25',
  Amount: '$10,000',
  Subject: 'Data Structures',
  Roll: '12345678'
};

async function fillPdf(meta, data) {
  const [pdfBytes, fontBytes] = await Promise.all([
    readFile(templatePath),
    readFile(fontPath)
  ]);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const [page] = pdfDoc.getPages();
  const { width, height } = page.getSize();

  const TOP_MARGIN = 380; // 👈 Adjust this to push everything down further
  let currentY = height - TOP_MARGIN;

  // Title
  const titleSize = 24;
  const titleWidth = customFont.widthOfTextAtSize(meta.title, titleSize);
  page.drawText(meta.title, {
    x: (width - titleWidth) / 2,
    y: currentY,
    size: titleSize,
    font: customFont,
    color: rgb(0, 0, 0)
  });

  // Subtitle
  const subtitleSize = 18;
  const subtitleWidth = customFont.widthOfTextAtSize(meta.subtitle, subtitleSize);
  currentY -= 32;
  page.drawText(meta.subtitle, {
    x: (width - subtitleWidth) / 2,
    y: currentY,
    size: subtitleSize,
    font: customFont,
    color: rgb(0, 0, 0)
  });

  // Data lines
  currentY -= 40;
  for (const [key, value] of Object.entries(data)) {
    const text = `${key}: ${value}`;
    const size = 14;
    const textWidth = customFont.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: currentY,
      size,
      font: customFont,
      color: rgb(0, 0, 0)
    });
    currentY -= 22;
  }

  const finalPdf = await pdfDoc.save();
  await writeFile(outputPath, finalPdf);
  console.log('✅ PDF generated:', outputPath);
}

fillPdf(meta, data);
