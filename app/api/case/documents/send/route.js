import dbConnect from '@/app/db/page'
import Case from '@/app/models/Case'

export async function POST(req) {
    try {
        await dbConnect();

        const url = new URL(req.url, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'); 
        const id = url.searchParams.get("id");
        const body = await req.json();
        const doc = body;

        if (!doc || !doc.fileName || !doc.path || !id) {
            return new Response(JSON.stringify({ message: "Missing Parameters" }), { status: 400 });
        }

        const updatedCase = await Case.findById(id);

        if (!updatedCase) {
            return new Response(JSON.stringify({ message: "Case not found" }), { status: 404 });
        }

        updatedCase.documents.push({
            fileName: doc.fileName,
            path: doc.path,
            from: 'User',
            status: 'Signed',  // Assuming after sending, it becomes signed
            needsESign: doc.needsESign || false,
        });

        const requestedDoc = updatedCase.requestedDocuments.id(doc._id);
        if (requestedDoc) {
            requestedDoc.fulfilled = true;
        }

        await updatedCase.save();

        return new Response(JSON.stringify({ message: "Document sent successfully" }), { status: 200 });    


    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ message: "something went wrong " + err.message }), { status: 500 });
    }
}