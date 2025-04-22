import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const filePath = path.join(process.cwd(), 'public', 'assets', filename);

  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // delete file
      return res.status(200).json({ message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
}
