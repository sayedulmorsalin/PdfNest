// Vercel Serverless Function: PPTX to PDF via ConvertAPI
// Free tier: 250 conversions/month
// Set CONVERTAPI_SECRET in Vercel Environment Variables
// Get your free secret at: https://www.convertapi.com/a/si

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiSecret = process.env.CONVERTAPI_SECRET;
  if (!apiSecret) {
    return res.status(500).json({
      error: 'ConvertAPI secret is not configured on Vercel. Please add CONVERTAPI_SECRET in Vercel Project Settings -> Environment Variables (get a free key at https://www.convertapi.com/a/si).',
    });
  }

  try {
    let fileParam = null;
    let originalFilename = 'presentation.pptx';
    const contentType = req.headers['content-type'] || '';

    // Case 1: JSON request with fileUrl (bypasses Vercel 4.5MB Serverless request body limit)
    if (contentType.includes('application/json')) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyStr = Buffer.concat(chunks).toString('utf8');
      const data = JSON.parse(bodyStr);

      if (!data.fileUrl) {
        return res.status(400).json({ error: 'Missing fileUrl in JSON request' });
      }

      originalFilename = data.filename || 'presentation.pptx';
      fileParam = {
        Name: 'File',
        Value: data.fileUrl,
      };
    }
    // Case 2: Multipart FormData upload (direct file upload)
    else if (contentType.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return res.status(400).json({ error: 'Invalid request: missing multipart boundary' });
      }

      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks);
      const fileData = extractFile(body, boundary);

      if (!fileData) {
        return res.status(400).json({ error: 'No file found in multipart request' });
      }

      originalFilename = fileData.filename || 'presentation.pptx';
      fileParam = {
        Name: 'File',
        FileValue: {
          Name: originalFilename,
          Data: fileData.buffer.toString('base64'),
        },
      };
    } else {
      return res.status(400).json({ error: `Unsupported content-type: ${contentType}` });
    }

    // Call ConvertAPI
    const convertRes = await fetch(
      `https://v2.convertapi.com/convert/pptx/to/pdf?Secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Parameters: [fileParam],
        }),
      }
    );

    if (!convertRes.ok) {
      const errData = await convertRes.json().catch(() => ({}));
      throw new Error(errData.Message || `ConvertAPI error (${convertRes.status}: ${convertRes.statusText})`);
    }

    const result = await convertRes.json();

    if (!result.Files || result.Files.length === 0) {
      throw new Error('ConvertAPI returned no PDF files');
    }

    // Extract PDF buffer
    let pdfBuffer;
    if (result.Files[0].FileData) {
      pdfBuffer = Buffer.from(result.Files[0].FileData, 'base64');
    } else if (result.Files[0].Url) {
      const pdfRes = await fetch(result.Files[0].Url);
      const arrayBuf = await pdfRes.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuf);
    } else {
      throw new Error('No valid PDF data returned from ConvertAPI');
    }

    const pdfFilename = originalFilename.replace(/\.pptx?$/i, '.pdf');

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
