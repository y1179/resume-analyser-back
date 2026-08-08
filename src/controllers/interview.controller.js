
// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
// const extractText = require("../utils/extractText");
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");

// /**
//  * @description Controller to generate interview report.
//  * FIXED: Added robust checks for req.user and improved error handling for AI timeouts.
//  */
// async function generateInterViewReportController(req, res) {
//     try {
//         // 1. AUTH CHECK: Prevent "Cannot read properties of null (reading '_id')"
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({ message: "User authentication failed. Please log in again." });
//         }

//         const { selfDescription, jobDescription } = req.body;

//         // 2. VALIDATION
//         if (!req.file && !selfDescription) {
//             return res.status(400).json({
//                 message: "Please upload a resume or provide a self-description."
//             });
//         }

//         let resumeText = "";

//         // 3. PDF PARSING: Wrap in specific try/catch
//         // if (req.file) {
//         //     try {
//         //         const resumeContent = await pdfParse(req.file.buffer);
//         //         resumeText = resumeContent.text;
//         //         if (!resumeText || resumeText.trim().length === 0) {
//         //             throw new Error("PDF is empty or unreadable");
//         //         }
//         //     } catch (err) {
//         //         console.error("PDF_PARSE_ERROR:", err.message);
//         //         return res.status(422).json({ message: "Failed to parse PDF file. Ensure it is not password protected." });
//         //     }
//         // }
        

// if (req.file) {
//     try {
//         resumeText = await extractText(req.file);
//     } catch (err) {
//         return res.status(422).json({
//             message: err.message,
//         });
//     }
// }

//         // 4. AI CALL: Set a local timeout flag if possible or handle long waits
//         const interViewReportByAi = await generateInterviewReport({
//             resume: resumeText,
//             selfDescription,
//             jobDescription
//         });

//         if (!interViewReportByAi) {
//             return res.status(500).json({ message: "AI service failed to return a report." });
//         }

//         // 5. SAVE TO DB: Spread the AI result correctly
//         const interviewReport = await interviewReportModel.create({
//             user: req.user.id, 
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...interViewReportByAi // Ensure this object matches your Schema keys
//         });

//         return res.status(201).json({
//             message: "Interview report generated successfully.",
//             interviewReport
//         });

//     } catch (error) {
//         console.error("GENERATE_REPORT_ERROR:", error);
//         // Avoid sending the full error object to frontend for security
//         return res.status(500).json({
//             message: "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }

// /**
//  * @description Controller to get interview report by ID.
//  */
// async function getInterviewReportByIdController(req, res) {
//     try {
//         // AUTH CHECK
//         if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//         const { interviewId } = req.params;

//         // Ensure we check that the report belongs to the logged-in user
//         const interviewReport = await interviewReportModel.findOne({ 
//             _id: interviewId, 
//             user: req.user.id 
//         });

//         if (!interviewReport) {
//             return res.status(404).json({ message: "Interview report not found." });
//         }

//         return res.status(200).json({
//             message: "Interview report fetched successfully.",
//             interviewReport
//         });
//     } catch (error) {
//         console.error("GET_REPORT_ERROR:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// /** * @description Controller to get all reports for the user.
//  */
// async function getAllInterviewReportsController(req, res) {
//     try {
//         if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//         const interviewReports = await interviewReportModel.find({ user: req.user.id })
//             .sort({ createdAt: -1 })
//             // Exclude heavy fields for the list view to improve performance
//             .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v");

//         return res.status(200).json({
//             message: "Reports fetched successfully.",
//             interviewReports
//         });
//     } catch (error) {
//         console.error("GET_ALL_REPORTS_ERROR:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

// // ... Keep your generateResumePdfController as it was, but add a req.user check!
// async function generateResumePdfController(req, res) {
//     try {
//         const { interviewReportId } = req.params;

//         const interviewReport = await interviewReportModel.findById(interviewReportId);

//         if (!interviewReport) {
//             return res.status(404).json({
//                 message: "Interview report not found."
//             });
//         }

//         const { resume, jobDescription, selfDescription } = interviewReport;

//         const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
//         });

//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error("GENERATE_PDF_ERROR:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// module.exports = { 
//     generateInterViewReportController, 
//     getInterviewReportByIdController, 
//     getAllInterviewReportsController, 
//     generateResumePdfController 
// };



const extractText = require("../utils/extractText");
const chunkText = require("../utils/chunkText");
const { generateEmbeddings } = require("../utils/embedding");

const storeResume = require("../pinecone/storeResume");
const retrieveResume = require("../pinecone/retrieveResume");

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewReportController(req, res) {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "User authentication failed. Please log in again."
            });
        }

        const { selfDescription, jobDescription } = req.body;
              // 2. VALIDATION

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Please upload a resume or provide a self-description."
            });
        }

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            });
        }

        // 3. EXTRACT RESUME TEXT

        let resumeText = "";

        if (req.file) {
            try {
                resumeText = await extractText(req.file);

                if (!resumeText || resumeText.trim().length === 0) {
                    return res.status(422).json({
                        message: "Could not extract text from the uploaded resume."
                    });
                }

            } catch (error) {
                console.error("EXTRACT_TEXT_ERROR:", error);

                return res.status(422).json({
                    message: error.message || "Failed to extract resume text."
                });
            }
        }
         // Chunk resume
        const chunks = await chunkText(resumeText);

        console.log("Total chunks:", chunks.length);
        console.log("First chunk:", chunks[0]);

                // 5. GENERATE EMBEDDINGS

        const embeddings = await generateEmbeddings(chunks);

        console.log("Total embeddings:", embeddings.length);
        console.log("Embedding dimensions:", embeddings[0].length);

                // 6. STORE RESUME IN PINECONE

        await storeResume(
            req.user.id,
            chunks,
            embeddings
        );

        console.log("Resume stored in Pinecone successfully.");

                // 7. RETRIEVE RELEVANT RESUME CHUNKS

        const relevantChunks = await retrieveResume(
            req.user.id,
            jobDescription
        );

        console.log("Relevant chunks:", relevantChunks.length);
        console.log("Retrieved chunks:", relevantChunks);

                // 9. GENERATE INTERVIEW REPORT USING RAG

        const interViewReportByAi = await generateInterviewReport({
            resume: relevantResume,
            selfDescription,
            jobDescription
        });

        if (!interViewReportByAi) {
            return res.status(500).json({
                message: "AI service failed to return a report."
            });
        }

                // 10. SAVE INTERVIEW REPORT TO MONGODB

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

            } catch (error) {
        console.error("GENERATE_REPORT_ERROR:", error);

        return res.status(500).json({
            message: "Internal server error. The AI analysis might have timed out."
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("GET_REPORT_ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select(
                "-resume " +
                "-selfDescription " +
                "-jobDescription " +
                "-technicalQuestions " +
                "-behavioralQuestions " +
                "-skillGaps " +
                "-preparationPlan " +
                "-__v"
            );

        return res.status(200).json({
            message: "Reports fetched successfully.",
            interviewReports
        });

    } catch (error) {
        console.error("GET_ALL_REPORTS_ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function generateResumePdfController(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("GENERATE_PDF_ERROR:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};