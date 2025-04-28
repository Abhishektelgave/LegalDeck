import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connect from '@/app/db/page';
import Case from '@/app/models/Case';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { caseId, docName } = params;
  const { needsESign } = await request.json();

  await connect();
  const c = await Case.findById(caseId);
  if (!c) return new Response(JSON.stringify({ error: 'Case not found' }), { status: 404 });

  const doc = c.documents.find(d => d.name === docName);
  if (!doc) return new Response(JSON.stringify({ error: 'Document not found' }), { status: 404 });

  doc.needsESign = needsESign;
  await c.save();

  return new Response(JSON.stringify({ success: true, document: doc }), { status: 200 });
}
