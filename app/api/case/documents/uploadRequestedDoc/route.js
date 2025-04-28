import dbConnect from "@/app/db/page";
import Case from '@/app/models/Case';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        await dbConnect()

        const formData = await req.formData();
        const file = formData.get('file');
        const docId = formData.get('docId');
        const caseId = formData.get('caseId');
        if (!file || !caseId || !docId || typeof file !== 'object') {
            return new Response(JSON.stringify({ message: 'missing parameters' }), { status: 404 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public/assets/files', caseId);
        await mkdir(uploadDir, { recursive: true });
        const uri = `/assets/files/${caseId}/${file.name}`;
        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, buffer);

        await Case.updateOne(
            { _id: caseId, 'requestedDocuments._id': docId },
            {
                $set: {
                    'requestedDocuments.$.path': uri,
                }
            }
        );


        return new Response(JSON.stringify({ message: 'upload success' }), { status: 200 });

    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: 'something went workng' + err.message }), { status: 500 });
    }
}