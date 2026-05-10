import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';

// Test PDF extraction
async function testPdfExtraction() {
  try {
    // Create a simple test PDF
    const testPdfPath = './test.pdf';
    
    // Check if test PDF exists
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ No test PDF found. Creating a simple test...');
      return false;
    }

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs';

    // Read the PDF file
    const fileBuffer = fs.readFileSync(testPdfPath);
    const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

    // Load the PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(`✅ PDF loaded successfully with ${pdf.numPages} page(s)`);

    // Extract text from first page
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const extractedText = textContent.items.map((item) => item.str).join(' ');

    console.log(`✅ Text extracted successfully:`);
    console.log(`   "${extractedText.substring(0, 100)}..."`);
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

// Run test
const result = await testPdfExtraction();
process.exit(result ? 0 : 1);
