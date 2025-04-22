import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const username = formData.get('username');

    if (!file || typeof file !== 'object' || !username) {
      return new Response(JSON.stringify({ error: 'Missing file or username' }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/assets/files', username);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    return new Response(
      JSON.stringify({
        message: 'Upload successful',
        filename: file.name,
        fileUrl: `public/assets/files/${username}/${file.name}`,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Upload Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
