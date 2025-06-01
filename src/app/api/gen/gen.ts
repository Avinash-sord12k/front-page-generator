import { FontManager } from '@/lib/font';
import { randomUUID } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';

const templatePath = path.join(process.cwd(), 'templates', 'base-adgips.pdf');
const outputDir = os.tmpdir();

const meta = {
  title: 'LAB MANUAL',
  subtitle: 'B. Tech - 7ᵗʰ Semester'
};

const data = {
  'Faculty Name': 'Mr. Neeraj',
  'Subject Name': 'Statistics, Statistical Modelling and Data Analytics Lab',
  'Paper Code': 'DA-304P',
  'Student Name': 'Ayush Singh Negi',
  'Enrolment No.': '14615603122',
  'Section': 'T7',
};

export async function fillPdf(meta: Record<string, string>, data: Record<string, string>) {
  console.log({ templatePath })
  const pdfBytes = await readFile(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Setup font manager
  const fontManager = new FontManager(pdfDoc, {
    100: './public/fonts/static/NotoSans-Thin.ttf',
    200: './public/fonts/static/NotoSans-ExtraLight.ttf',
    300: './public/fonts/static/NotoSans-Light.ttf',
    400: './public/fonts/static/NotoSans-Regular.ttf',
    500: './public/fonts/static/NotoSans-Medium.ttf',
    600: './public/fonts/static/NotoSans-SemiBold.ttf',
    700: './public/fonts/static/NotoSans-Bold.ttf',
    800: './public/fonts/static/NotoSans-ExtraBold.ttf'
  });
  await fontManager.load();

  const titleFont = await fontManager.getFont(800); // Bold
  const bodyFont = await fontManager.getFont(500);  // Regular

  const [page] = pdfDoc.getPages();
  const { width, height } = page.getSize();

  const TOP_MARGIN = 380;
  let currentY = height - TOP_MARGIN;

  // Title
  const titleSize = 24;
  const titleWidth = titleFont.widthOfTextAtSize(meta.title, titleSize);
  page.drawText(meta.title, {
    x: (width - titleWidth) / 2,
    y: currentY,
    size: titleSize,
    font: titleFont,
    color: rgb(0, 0, 0),
  });

  // Subtitle
  const subtitleSize = 18;
  const subtitleWidth = titleFont.widthOfTextAtSize(meta.subtitle, subtitleSize);
  currentY -= 32;
  page.drawText(meta.subtitle, {
    x: (width - subtitleWidth) / 2,
    y: currentY,
    size: subtitleSize,
    font: titleFont,
    color: rgb(0, 0, 0),
  });

  // Data lines
  const size = 14;
  const lineGap = 22;

  const keyWidths = Object.keys(data).map((k) => bodyFont.widthOfTextAtSize(k, size));
  const valueWidths = Object.values(data).map((v) => bodyFont.widthOfTextAtSize(v, size));

  const maxKeyWidth = Math.max(...keyWidths);
  const maxValueWidth = Math.max(...valueWidths);
  const colonWidth = bodyFont.widthOfTextAtSize(':    ', size);
  const gapBetweenColumns = 8;

  const blockWidth = maxKeyWidth + colonWidth + gapBetweenColumns + maxValueWidth;
  const blockX = (width - blockWidth) / 2;
  const keyX = blockX;
  const colonX = keyX + maxKeyWidth;
  const valueX = colonX + colonWidth + gapBetweenColumns;

  currentY -= 40;
  for (const [key, value] of Object.entries(data)) {
    page.drawText(key, {
      x: keyX,
      y: currentY,
      size,
      font: bodyFont,
      color: rgb(0, 0, 0)
    });

    page.drawText('    :', {
      x: colonX,
      y: currentY,
      size,
      font: bodyFont,
      color: rgb(0, 0, 0)
    });

    page.drawText(value, {
      x: valueX,
      y: currentY,
      size,
      font: bodyFont,
      color: rgb(0, 0, 0)
    });

    currentY -= lineGap;
  }

  const finalPdf = await pdfDoc.save();
  const fileName = randomUUID() + '.pdf';
  const outputPath = path.join(outputDir, fileName);

  await writeFile(outputPath, finalPdf);
  console.log('✅ PDF generated:', outputPath);

  return {
    url: `/api/files/${fileName}`
  }
}

fillPdf(meta, data);
