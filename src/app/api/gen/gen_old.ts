import fontkit from '@pdf-lib/fontkit';
import { readFile, writeFile } from 'fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';

const templatePath = './public/templates/base-adgips.pdf';
const outputPath = './filled_output.pdf';
const fontPath = './public/fonts/NotoSans-VariableFont_wdth,wght.ttf'; // path to your .ttf

const meta = {
  title: 'LAB MANUAL',
  subtitle: 'B. Tech - 7ᵗʰ Semester'
};

const data = {
  'Name': 'Avinash Jha',
  'Date': '2025-05-25',
  'Amount': '$10,000',
  'Subject': 'Data Structures',
  'Roll': '12345678',
  'Faculty Name': 'Mr. Neeraj',
  'Subject Name': 'Statistics, Statistical Modelling and Data Analytics Lab',
  'Paper Code': 'DA-304P',
  'Student Name': 'Ayush Singh Negi',
  'Enrolment No.': '14615603122',
  'Section': 'T7',
};

async function fillPdf(meta: Record<string, string>, data: Record<string, string>) {
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

  // Data lines block (aligned columns)
  const size = 14;
  const lineGap = 22;

  // Step 1: Measure the widest key
  const keyWidths = Object.keys(data).map((k: string) => customFont.widthOfTextAtSize(k, size));
  const maxKeyWidth = Math.max(...keyWidths);

  const valueWidths = Object.values(data).map((t: string) => customFont.widthOfTextAtSize(t, size));
  const maxValueWIdth = Math.max(...valueWidths)

  // Step 2: Define margins
  const padding = 10;
  const colonWidth = customFont.widthOfTextAtSize(':    ', size);
  const gapBetweenColumns = 8; // space between colon and value
  const blockWidth = maxKeyWidth + colonWidth + gapBetweenColumns + maxValueWIdth; // 200 is estimated value column width

  // Step 3: Center the whole block
  const blockX = (width - blockWidth) / 2;
  const keyX = blockX;
  const colonX = keyX + maxKeyWidth;
  const valueX = colonX + colonWidth + gapBetweenColumns;

  // Step 4: Draw each line
  currentY -= 40;
  for (const [key, value] of Object.entries(data)) {
    page.drawText(key, {
      x: keyX,
      y: currentY,
      size,
      font: customFont,
      color: rgb(0, 0, 0)
    });

    page.drawText('    :', {
      x: colonX,
      y: currentY,
      size,
      font: customFont,
      color: rgb(0, 0, 0)
    });

    page.drawText(value, {
      x: valueX,
      y: currentY,
      size,
      font: customFont,
      color: rgb(0, 0, 0)
    });

    currentY -= lineGap;
  }

  const finalPdf = await pdfDoc.save();
  await writeFile(outputPath, finalPdf);
  console.log('✅ PDF generated:', outputPath);
}

fillPdf(meta, data);
