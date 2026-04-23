// api/fetch-doc.js
// Vercel serverless function — server-side proxy for Google Doc content

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { docId } = req.query;
  if (!docId || !/^[a-zA-Z0-9_-]+$/.test(docId)) {
    return res.status(400).json({ error: 'Invalid or missing docId' });
  }

  const urls = [
    `https://docs.google.com/document/d/${docId}/export?format=txt`,
    `https://docs.google.com/document/export?format=txt&id=${docId}`,
  ];

  let lastError = 'Could not fetch document.';

  for (const url of urls) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VisionFlow/1.0)' },
        redirect: 'follow',
      });

      const text = await r.text();

      // Google returns HTML login page if doc is not public
      if (text.includes('accounts.google.com') || text.includes('ServiceLogin') || text.includes('You need access')) {
        lastError = 'Document is not publicly shared. In Google Docs: Share → Change to "Anyone with the link" → Viewer → Done. Then copy the /edit link.';
        continue;
      }

      if (!r.ok) {
        lastError = `Google returned ${r.status}. Check the document is shared publicly.`;
        continue;
      }

      if (text.trim().length < 50) {
        lastError = 'Document appears empty — fill in your practice details first.';
        continue;
      }

      // Strip HTML if needed
      let clean = text;
      if (text.trimStart().startsWith('<')) {
        clean = text
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s{3,}/g, '\n\n')
          .trim();
      }

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(clean);

    } catch (e) {
      lastError = e.message;
    }
  }

  return res.status(500).json({ error: lastError });
}