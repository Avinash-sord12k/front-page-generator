// font.ts
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'fs/promises';
import { PDFDocument, PDFFont } from 'pdf-lib';

export class FontManager {
  private pdfDoc: PDFDocument;
  private fontPaths: Record<number, string>;
  private fonts: Map<number, Promise<PDFFont>>;

  constructor(pdfDoc: PDFDocument, fontPaths: Record<number, string>) {
    this.pdfDoc = pdfDoc;
    this.fontPaths = fontPaths;
    this.fonts = new Map();
  }

  async load() {
    this.pdfDoc.registerFontkit(fontkit);

    for (const [weight, path] of Object.entries(this.fontPaths)) {
      const fontBytes = await readFile(path);
      this.fonts.set(Number(weight), this.pdfDoc.embedFont(fontBytes));
    }
  }

  async getFont(weight: number): Promise<PDFFont> {
    const font = this.fonts.get(weight);
    if (!font) throw new Error(`Font for weight ${weight} not found`);
    return font;
  }
}
