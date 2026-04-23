// api/fetch-doc.js
// Vercel serverless function — proxies Google Doc export to avoid CORS

export default async function handler(req, res) {
  // Allow CORS from your app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { docId } = req.query;

  if (!docId) {
    return res.status(400).json({ error: 'Missing docId parameter' });
  }

  // Validate docId format — only alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(docId)) {
    return res.status(400).json({ error: 'Invalid docId format' });
  }

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  try {
    const response = await fetch(exportUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VisionFlowBot/1.0)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Google returned ${response.status}. Make sure the document is shared as "Anyone with the link can view".`
      });
    }

    const text = await response.text();

    if (!text || text.length < 50) {
      return res.status(422).json({
        error: 'Document appears empty. Make sure it is filled in and publicly shared.'
      });
    }

    // Return plain text
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ error: `Fetch failed: ${err.message}` });
  }
}