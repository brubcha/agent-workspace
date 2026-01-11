const fs = require("fs");
const pdf = require("pdf-parse");

async function extract(pdfPath, outPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  try {
    const parsePdf = (pdf && (typeof pdf === 'function' ? pdf : pdf.default || pdf.parse)) || pdf;
    let data;
    if (typeof parsePdf === 'function') {
      data = await parsePdf(dataBuffer);
    } else if (pdf && pdf.PDFParse) {
      const parser = new pdf.PDFParse({ data: dataBuffer });
      data = await parser.getText();
    } else {
      throw new Error('No suitable pdf parser available');
    }
    const text = typeof data === 'string' ? data : data.text || String(data);
    fs.writeFileSync(outPath, text, 'utf8');
    console.log('WROTE', outPath);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
}

const [, , pdfPath, outPath] = process.argv;
if (!pdfPath || !outPath) {
  console.error("Usage: node extract_pdf.js <input.pdf> <output.txt>");
  process.exit(1);
}
extract(pdfPath, outPath);
