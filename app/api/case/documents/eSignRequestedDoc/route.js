import { PDFDocument, rgb } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';
import Case from '@/app/models/Case';
import connectDB from '@/app/db/page';

export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const caseId = searchParams.get('caseId');
        const docId = searchParams.get('docId');

        if (!caseId || !docId) {
            return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
        }

        await connectDB();

        const theCase = await Case.findById(caseId);
        if (!theCase) {
            return new Response(JSON.stringify({ error: 'Case not found' }), { status: 404 });
        }

        const requestedDoc = theCase.requestedDocuments.id(docId);
        if (!requestedDoc || !requestedDoc.path) {
            return new Response(JSON.stringify({ error: 'Requested document not found' }), { status: 404 });
        }

        const filePath = path.join(process.cwd(), 'public', requestedDoc.path);
        const existingPdfBytes = await fs.readFile(filePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        firstPage.drawText('Signed Electronically', {
            x: 50,
            y: 50,
            size: 24,
            color: rgb(0, 0.53, 0.71),
        });

        const newPdfBytes = await pdfDoc.save();

        const originalNameWithoutExt = requestedDoc.fileName.replace(/\.pdf$/i, '');
        const newFileName = `${originalNameWithoutExt} E-Sign.pdf`;
        const newPath = `uploads/${newFileName}`;
        const fullNewPath = path.join(process.cwd(), 'public', newPath);

        await fs.writeFile(fullNewPath, newPdfBytes);

        // Update requested document fields
        requestedDoc.path = newPath;
        requestedDoc.fileName = newFileName;
        requestedDoc.fulfilled = false;

        await theCase.save();

        return new Response(JSON.stringify({ message: 'Document e-signed successfully!' }), { status: 200 });

    } catch (error) {
        console.error('Error during e-sign:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
