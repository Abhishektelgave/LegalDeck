// Handles upload for requested documents by user
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connect from '@/app/db/page';
import Case from '@/app/models/Case';
import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

async function parseFormData(request, caseId) {
  const data = await request.formData();
  const file = data.get('file');
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadDir = path.join(process.cwd(), 'public/assets/files', caseId);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  const url = `/assets/files/${caseId}/${file.name}`;
  return { fileName: file.name, url };
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'User') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { fileName, url } = await parseFormData(request, params.caseId);

    await connect();
    const c = await Case.findById(params.caseId);
    const req = c.requestedDocuments.find(r =>
      r.name === params.docName && !r.fulfilled
    );

    if (!req) {
      return new Response(JSON.stringify({ error: 'No such request' }), { status: 404 });
    }

    req.fulfilled = true;
    req.fileUrl = url;
    c.documents.push({
      name: fileName,
      url,
      from: 'User',
      needsESign: req.needsESign,
      status: 'pending'
    });

    await c.save();

    return new Response(JSON.stringify({ success: true, file: { name: fileName, url } }), {
      status: 200
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
}
