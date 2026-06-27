import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, FileUp, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';

// Parse mammoth HTML into structured blocks for jsPDF text rendering
function parseHtmlToBlocks(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks = [];

  function processNode(node) {
    const tag = node.nodeName.toLowerCase();

    if (tag === 'h1') {
      blocks.push({ type: 'h1', text: node.textContent.trim() });
    } else if (tag === 'h2') {
      blocks.push({ type: 'h2', text: node.textContent.trim() });
    } else if (tag === 'h3') {
      blocks.push({ type: 'h3', text: node.textContent.trim() });
    } else if (tag === 'p') {
      const text = node.textContent.trim();
      if (text) {
        const hasBold = node.querySelector('strong, b');
        blocks.push({ type: 'p', text, bold: !!hasBold });
      } else {
        blocks.push({ type: 'gap' });
      }
    } else if (tag === 'ul') {
      const items = Array.from(node.querySelectorAll(':scope > li'));
      items.forEach(li => {
        const text = li.textContent.trim();
        if (text) blocks.push({ type: 'bullet', text });
      });
    } else if (tag === 'ol') {
      const items = Array.from(node.querySelectorAll(':scope > li'));
      items.forEach((li, i) => {
        const text = li.textContent.trim();
        if (text) blocks.push({ type: 'numbered', text, num: i + 1 });
      });
    } else if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr'));
      rows.forEach((row, rowIdx) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        const cellTexts = cells.map(c => c.textContent.trim());
        blocks.push({ type: 'tableRow', cells: cellTexts, isHeader: rowIdx === 0 });
      });
    } else if (tag === 'hr') {
      blocks.push({ type: 'hr' });
    } else if (tag === 'br') {
      blocks.push({ type: 'gap' });
    } else {
      // Recurse into unknown/container elements
      for (const child of node.childNodes) {
        if (child.nodeType === 1) processNode(child);
      }
    }
  }

  for (const child of doc.body.childNodes) {
    if (child.nodeType === 1) processNode(child);
  }

  return blocks;
}

// Word-wrap text to fit within maxWidth given font size
function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(text, maxWidth);
}

// Render blocks to PDF using jsPDF text API
async function renderBlocksToPdf(blocks, fileName) {
  const PAGE_W = 210; // A4 mm
  const PAGE_H = 297;
  const MARGIN_X = 20;
  const MARGIN_TOP = 25;
  const MARGIN_BOTTOM = 25;
  const TEXT_W = PAGE_W - MARGIN_X * 2;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN_TOP;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  };

  const drawLine = (text, x, currentY, size, style = 'normal', color = [30, 30, 30]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    doc.text(text, x, currentY);
  };

  for (const block of blocks) {
    if (block.type === 'h1') {
      checkPageBreak(14);
      y += 4;
      drawLine(block.text, MARGIN_X, y, 20, 'bold', [15, 15, 15]);
      y += 11;
      // Underline
      doc.setDrawColor(80, 80, 220);
      doc.setLineWidth(0.6);
      doc.line(MARGIN_X, y - 3, MARGIN_X + TEXT_W, y - 3);
      y += 4;
    } else if (block.type === 'h2') {
      checkPageBreak(11);
      y += 3;
      drawLine(block.text, MARGIN_X, y, 16, 'bold', [15, 15, 50]);
      y += 9;
    } else if (block.type === 'h3') {
      checkPageBreak(9);
      y += 2;
      drawLine(block.text, MARGIN_X, y, 13, 'bold', [30, 30, 30]);
      y += 7;
    } else if (block.type === 'p') {
      const lines = wrapText(doc, block.text, TEXT_W);
      const lineH = 5.5;
      checkPageBreak(lines.length * lineH + 3);
      doc.setFontSize(11);
      doc.setFont('helvetica', block.bold ? 'bold' : 'normal');
      doc.setTextColor(40, 40, 40);
      for (const line of lines) {
        checkPageBreak(lineH);
        doc.text(line, MARGIN_X, y);
        y += lineH;
      }
      y += 2;
    } else if (block.type === 'bullet') {
      const lines = wrapText(doc, block.text, TEXT_W - 8);
      const lineH = 5.5;
      checkPageBreak(lines.length * lineH + 1);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      // Draw bullet circle
      doc.setFillColor(80, 80, 220);
      doc.circle(MARGIN_X + 2, y - 1.5, 1, 'F');
      doc.text(lines[0], MARGIN_X + 7, y);
      y += lineH;
      for (let i = 1; i < lines.length; i++) {
        checkPageBreak(lineH);
        doc.text(lines[i], MARGIN_X + 7, y);
        y += lineH;
      }
      y += 1;
    } else if (block.type === 'numbered') {
      const prefix = `${block.num}.  `;
      const lines = wrapText(doc, block.text, TEXT_W - 8);
      const lineH = 5.5;
      checkPageBreak(lines.length * lineH + 1);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(prefix + lines[0], MARGIN_X + 2, y);
      y += lineH;
      for (let i = 1; i < lines.length; i++) {
        checkPageBreak(lineH);
        doc.text(lines[i], MARGIN_X + 9, y);
        y += lineH;
      }
      y += 1;
    } else if (block.type === 'tableRow') {
      const colW = Math.min(TEXT_W / block.cells.length, 50);
      const rowH = 7;
      checkPageBreak(rowH + 2);
      if (block.isHeader) {
        doc.setFillColor(230, 230, 250);
        doc.rect(MARGIN_X, y - 5, TEXT_W, rowH, 'F');
      }
      doc.setFontSize(9);
      doc.setFont('helvetica', block.isHeader ? 'bold' : 'normal');
      doc.setTextColor(30, 30, 30);
      block.cells.forEach((cell, i) => {
        const truncated = cell.length > 25 ? cell.slice(0, 22) + '…' : cell;
        doc.text(truncated, MARGIN_X + i * colW + 2, y);
      });
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(MARGIN_X, y + 2, MARGIN_X + TEXT_W, y + 2);
      y += rowH;
    } else if (block.type === 'hr') {
      y += 3;
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.4);
      doc.line(MARGIN_X, y, MARGIN_X + TEXT_W, y);
      y += 4;
    } else if (block.type === 'gap') {
      y += 3;
    }
  }

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W / 2, PAGE_H - 10, { align: 'center' });
  }

  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export default function WordToPdfTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = (f) => {
    if (!f) return;
    const isDocx = f.name.endsWith('.docx') || f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (isDocx) {
      setFile(f);
      setStatus({ type: null, message: '' });
    } else {
      setStatus({ type: 'error', message: 'Please select a valid Word (.docx) file.' });
    }
  };

  const handleFileChange = (e) => validateAndSet(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a Word (.docx) file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Reading Word document…' });

    try {
      // Dynamically import mammoth to use the browser build
      const mammoth = (await import('mammoth/mammoth.browser.js')).default;

      const arrayBuffer = await file.arrayBuffer();

      setStatus({ type: 'loading', message: 'Parsing document structure…' });
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (!result.value || !result.value.trim()) {
        throw new Error('The Word document appears to be empty or cannot be read.');
      }

      setStatus({ type: 'loading', message: 'Building PDF layout…' });
      const blocks = parseHtmlToBlocks(result.value);

      if (blocks.length === 0) {
        throw new Error('No readable content found in the document.');
      }

      setStatus({ type: 'loading', message: 'Generating PDF…' });
      const outputName = file.name.replace(/\.docx?$/i, '.pdf');
      await renderBlocksToPdf(blocks, outputName);

      setStatus({ type: 'success', message: `✅ "${outputName}" downloaded successfully!` });
    } catch (err) {
      console.error('Word to PDF conversion error:', err);
      setStatus({ type: 'error', message: `❌ Conversion failed: ${err.message}` });
    }
  };

  const reset = () => {
    setFile(null);
    setStatus({ type: null, message: '' });
  };

  return (
    <div className="space-y-5">
      {/* Status Bar */}
      {status.type && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
          status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
          status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
          'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{status.message}</span>
          <button onClick={() => setStatus({ type: null, message: '' })} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <label
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-primary/50 hover:bg-white/2'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="text-lg font-semibold text-white mb-1">
            {isDragging ? 'Drop your file here' : 'Upload Word Document'}
          </span>
          <span className="text-sm text-muted-foreground mb-3">Click to browse or drag & drop your .docx file</span>
          <span className="text-xs text-muted-foreground/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">Supports .docx format</span>
          <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Word Document</p>
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Button */}
      {file && (
        <button
          onClick={handleConvert}
          disabled={status.type === 'loading'}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 text-sm"
        >
          {status.type === 'loading' ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <FileUp className="w-4 h-4" />
              Convert to PDF
            </>
          )}
        </button>
      )}

      {/* Info note */}
      {!file && (
        <p className="text-center text-xs text-muted-foreground/60">
          🔒 Your file is processed entirely in your browser — never uploaded to any server.
        </p>
      )}
    </div>
  );
}
