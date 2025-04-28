import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import Case from '@/app/models/Case';
import dbConnect from '@/app/db/page';

const ESIGN_API_KEY = process.env.ESIGN_API_KEY;

export async function POST(req) {
  try {
    // Connect to DB
    await dbConnect();

    // Get parameters from the request body
    const { caseId, docId, signerName, signerEmail } = await req.json();

    // Fetch the case data from MongoDB
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return new Response(JSON.stringify({ error: 'Case not found.' }), { status: 404 });
    }

    // Find the requested document
    const requestedDoc = caseData.requestedDocuments.id(docId);
    if (!requestedDoc) {
      return new Response(JSON.stringify({ error: 'Requested document not found.' }), { status: 404 });
    }

    if (!requestedDoc.path) {
      return new Response(JSON.stringify({ error: 'Requested document has no path.' }), { status: 400 });
    }

    // Read the file content
    const oldFilePath = path.join(process.cwd(), 'public', requestedDoc.path);
    const fileBuffer = await fs.readFile(oldFilePath);

    // Get original file name
    const originalFileName = path.basename(oldFilePath);

    // Generate new file name
    const ext = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, ext);
    const newFileName = `${baseName}_ESign${ext}`;

    // Create the new file path
    const newDir = path.join(process.cwd(), 'public/assets/files', caseId);
    const newFilePath = path.join(newDir, newFileName);

    // Ensure the directory exists
    await fs.mkdir(newDir, { recursive: true });

    // Save a copy of the file with the new name
    await fs.writeFile(newFilePath, fileBuffer);

    // Convert to Base64 for BoldSign
    const base64File = fileBuffer.toString('base64');

    // Send document to BoldSign using raw fetch API call
    const response = await fetch('https://sandbox.boldsign.com/v1/document/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ESIGN_API_KEY}`,
      },
      body: JSON.stringify({
        files: [
          {
            fileData: base64File,
            fileName: originalFileName,
          },
        ],
        title: baseName,
        message: 'Please sign this document.',
        signers: [
          {
            signerName,
            signerEmail,
            signerOrder: 1,
          },
        ],
        createEmbeddedSigningLink: true, // Automatically generate signing link
      }),
    });

    // Check if the response body is empty or not in JSON format
    const responseText = await response.text(); // Get response as plain text first
    console.log('BoldSign Response:', responseText);

    if (!response.ok || !responseText) {
      return new Response(JSON.stringify({ error: 'Failed to send document to BoldSign or no response.' }), { status: 500 });
    }

    let boldsignData;
    try {
      boldsignData = JSON.parse(responseText); // Attempt to parse the JSON
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to parse BoldSign response.' }), { status: 500 });
    }

    // Ensure the response contains the signing URL
    if (!boldsignData.embeddedSigningLinkDetails) {
      return new Response(JSON.stringify({ error: 'Failed to generate signing URL.' }), { status: 500 });
    }

    const signingUrl = boldsignData.embeddedSigningLinkDetails[0].signingUrl;
    if (!signingUrl) {
      return new Response(JSON.stringify({ error: 'Failed to generate signing URL.' }), { status: 500 });
    }

    // Update the document path and status in the MongoDB Case
    requestedDoc.path = path.join('assets', 'files', caseId, newFileName).replace(/\\/g, '/');
    requestedDoc.fulfilled = true;
    await caseData.save();

    // Delete the old file
    await fs.unlink(oldFilePath);

    // Return the signing URL as a success response
    return new Response(JSON.stringify({ success: true, signingUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error during e-sign:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
