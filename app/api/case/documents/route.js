import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
};

async function parseFormData(request) {
  const data = await request.formData();
  const file = data.get('file');
  const caseId = data.get('id');
  const from = data.get('from')
  const needsESign = data.get('needsESign') === 'true';

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), 'public/assets/files', caseId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  const uri = `/assets/files/${caseId}/${file.name}`;
  return { id: caseId, fileName: file.name, uri, from, needsESign };

}


export async function POST(req) {

  try {
    const { id, fileName, uri, from, needsESign } = await parseFormData(req);
    const updatedFrom = from === 'lawyer' ? 'Lawyer' : 'User';
    const updateStatus = needsESign ? 'Pending' : 'Unsigned';

    await dbConnect();
    const c = await Case.findById(id);
    if (!c) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    c.documents.push({
      fileName,
      path: uri,
      from: updatedFrom,
      status: updateStatus,
      needsESign,
    });

    await c.save();

    return new Response(JSON.stringify({
      success: true,
      document: { name: fileName, uri, from, needsESign }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('POST error:', err);
    return new Response(JSON.stringify({ error: 'File upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

