// Vercel Serverless Function: PPTX to PDF via ConvertAPI
// Free tier: 250 conversions/month
// Set CONVERTAPI_SECRET in Vercel Environment Variables
// Get your free secret at: https://www.convertapi.com/a/si

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiSecret = process.env.CONVERTAPI_SECRET;
  if (!apiSecret) {
    return res.status(500).json({
      error: 'ConvertAPI secret not configured. Set CONVERTAPI_SECRET in your Vercel environment variables.',
    });
  }

  try {
    // Read the raw request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    // Extract file from multipart form data
    const contentType = req.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'Invalid request: missing multipart boundary' });
    }

    const fileData = extractFile(body, boundary);
    if (!fileData) {
      return res.status(400).json({ error: 'No file found in request' });
    }

    // Convert file to base64 for ConvertAPI
    const base64File = fileData.buffer.toString('base64');

    // Call ConvertAPI (single request, simple!)
    const convertRes = await fetch(
      `https://v2.convertapi.com/convert/pptx/to/pdf?Secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Parameters: [
            {
              Name: 'File',
              FileValue: {
                Name: fileData.filename,
                Data: base64File,
              },
            },
          ],
        }),
      }
    );

    if (!convertRes.ok) {
      const errData = await convertRes.json().catch(() => ({}));
      throw new Error(errData.Message || `ConvertAPI error: ${convertRes.statusText}`);
    }

    const result = await convertRes.json();

    if (!result.Files || result.Files.length === 0) {
      throw new Error('ConvertAPI returned no files');
    }

    // Return the PDF as binary
    const pdfBase64 = result.Files[0].FileData;
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const pdfFilename = fileData.filename.replace(/\.pptx?$/i, '.pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('[convert-pptx] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

// ─── Parse multipart form data to extract the uploaded file ─────────────────
function extractFile(body, boundary) {
  const str = body.toString('binary');
  const parts = str.split(`--${boundary}`);

  for (const part of parts) {
    if (!part.includes('filename=')) continue;

    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    const headers = part.substring(0, headerEnd);
    const match = headers.match(/filename="([^"]+)"/);
    const filename = match ? match[1] : 'presentation.pptx';

    let content = part.substring(headerEnd + 4);
    // Strip trailing boundary delimiter
    if (content.endsWith('\r\n')) content = content.slice(0, -2);

    return {
      filename,
      buffer: Buffer.from(content, 'binary'),
    };
  }

  return null;
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
};
