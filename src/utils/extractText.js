//extractText.js:text from resume file i.e pdf and docx only
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
    if (!file) {
        throw new Error("No file uploaded.");
    }

    let extractedText = "";

    switch (file.mimetype) {

        // PDF
        case "application/pdf": {
            const result = await pdfParse(file.buffer);
            extractedText = result.text;
            break;
        }

        // DOCX
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            const result = await mammoth.extractRawText({
                buffer: file.buffer,
            });

            extractedText = result.value;
            break;
        }

        default:
            throw new Error(
                "Unsupported file type. Only PDF and DOCX are allowed."
            );
    }

    if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No readable text found in the uploaded document.");
    }

    return extractedText.trim();
}

module.exports = extractText;