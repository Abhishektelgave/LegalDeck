import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';

export async function GET(request) {

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  await dbConnect();

  const c = await Case.findById(id).lean();
  if (!c) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(c.requestedDocuments), { status: 200 });
}

export async function POST(request) {

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const { name, needsESign } = await request.json();

  await dbConnect();

  const c = await Case.findById(id);
  c.requestedDocuments.push({ fileName: name, needsESign, fulfilled: false });
  await c.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
