import dbConnect from "@/app/db/page";
import Case from "@/app/models/Case";

export async function GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    try {
        await dbConnect();

        const foundCase = await Case.findById(id);

        if (!foundCase) {
            return new Response(JSON.stringify({ error: "Case not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Filter documents from the case
        const lawyerDocs = foundCase.documents.filter((doc) => {
            return doc.from === "Lawyer" && doc.needsESign === false;
        });
        const lawyerEsignRequestDocs = foundCase.documents.filter((doc) => {
            return doc.from === "Lawyer" && doc.needsESign === true;
        });
        const userDocs = foundCase.documents.filter((doc) => doc.from === "User");
        const lawyerEsigndocs = foundCase.requestedDocuments.filter((doc) => {
            return doc.from === "Lawyer" && doc.fulfilled === false;
        });

        return new Response(JSON.stringify({ lawyerDocs, userDocs, lawyerEsignRequestDocs, lawyerEsigndocs }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("GET error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
