
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



// const extractText = require("../utils/extractText");
// const chunkText = require("../utils/chunkText");
// const { generateEmbeddings } = require("../utils/embedding");

// const storeResume = require("../pinecone/storeResume");
// const retrieveResume = require("../pinecone/retrieveResume");

// const {
//     generateInterviewReport,
//     generateResumePdf
// } = require("../services/ai.service");

// const interviewReportModel = require("../models/interviewReport.model");

// async function generateInterViewReportController(req, res) {
//     try {

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "User authentication failed. Please log in again."
//             });
//         }

//         const { selfDescription, jobDescription } = req.body;
//               // 2. VALIDATION

//         if (!req.file && !selfDescription) {
//             return res.status(400).json({
//                 message: "Please upload a resume or provide a self-description."
//             });
//         }

//         if (!jobDescription) {
//             return res.status(400).json({
//                 message: "Job description is required."
//             });
//         }

//         // 3. EXTRACT RESUME TEXT

//         let resumeText = "";

//         if (req.file) {
//             try {
//                 resumeText = await extractText(req.file);

//                 if (!resumeText || resumeText.trim().length === 0) {
//                     return res.status(422).json({
//                         message: "Could not extract text from the uploaded resume."
//                     });
//                 }

//             } catch (error) {
//                 console.error("EXTRACT_TEXT_ERROR:", error);

//                 return res.status(422).json({
//                     message: error.message || "Failed to extract resume text."
//                 });
//             }
//         }
//          // Chunk resume
//         const chunks = await chunkText(resumeText);

//         console.log("Total chunks:", chunks.length);
//         console.log("First chunk:", chunks[0]);

//                 // 5. GENERATE EMBEDDINGS

//         const embeddings = await generateEmbeddings(chunks);

//         console.log("Total embeddings:", embeddings.length);
//         console.log("Embedding dimensions:", embeddings[0].length);

//                 // 6. STORE RESUME IN PINECONE

//         await storeResume(
//             req.user.id,
//             chunks,
//             embeddings
//         );

//         console.log("Resume stored in Pinecone successfully.");

//                 // 7. RETRIEVE RELEVANT RESUME CHUNKS

//         const relevantChunks = await retrieveResume(
//             req.user.id,
//             jobDescription
//         );

//         console.log("Relevant chunks:", relevantChunks.length);
//         console.log("Retrieved chunks:", relevantChunks);

//                 // 9. GENERATE INTERVIEW REPORT USING RAG

//         const interViewReportByAi = await generateInterviewReport({
//             resume: relevantResume,
//             selfDescription,
//             jobDescription
//         });

//         if (!interViewReportByAi) {
//             return res.status(500).json({
//                 message: "AI service failed to return a report."
//             });
//         }

//                 // 10. SAVE INTERVIEW REPORT TO MONGODB

//         const interviewReport = await interviewReportModel.create({
//             user: req.user.id,
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...interViewReportByAi
//         });

//         return res.status(201).json({
//             message: "Interview report generated successfully.",
//             interviewReport
//         });

//             } catch (error) {
//         console.error("GENERATE_REPORT_ERROR:", error);

//         return res.status(500).json({
//             message: "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }

// async function getInterviewReportByIdController(req, res) {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const { interviewId } = req.params;

//         const interviewReport = await interviewReportModel.findOne({
//             _id: interviewId,
//             user: req.user.id
//         });

//         if (!interviewReport) {
//             return res.status(404).json({
//                 message: "Interview report not found."
//             });
//         }

//         return res.status(200).json({
//             message: "Interview report fetched successfully.",
//             interviewReport
//         });

//     } catch (error) {
//         console.error("GET_REPORT_ERROR:", error);

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }

// async function getAllInterviewReportsController(req, res) {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const interviewReports = await interviewReportModel
//             .find({ user: req.user.id })
//             .sort({ createdAt: -1 })
//             .select(
//                 "-resume " +
//                 "-selfDescription " +
//                 "-jobDescription " +
//                 "-technicalQuestions " +
//                 "-behavioralQuestions " +
//                 "-skillGaps " +
//                 "-preparationPlan " +
//                 "-__v"
//             );

//         return res.status(200).json({
//             message: "Reports fetched successfully.",
//             interviewReports
//         });

//     } catch (error) {
//         console.error("GET_ALL_REPORTS_ERROR:", error);

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }

// async function generateResumePdfController(req, res) {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const { interviewReportId } = req.params;

//         const interviewReport = await interviewReportModel.findOne({
//             _id: interviewReportId,
//             user: req.user.id
//         });

//         if (!interviewReport) {
//             return res.status(404).json({
//                 message: "Interview report not found."
//             });
//         }

//         const {
//             resume,
//             jobDescription,
//             selfDescription
//         } = interviewReport;

//         const pdfBuffer = await generateResumePdf({
//             resume,
//             jobDescription,
//             selfDescription
//         });

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition":
//                 `attachment; filename=resume_${interviewReportId}.pdf`
//         });

//         return res.send(pdfBuffer);

//     } catch (error) {
//         console.error("GENERATE_PDF_ERROR:", error);

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }

// module.exports = {
//     generateInterViewReportController,
//     getInterviewReportByIdController,
//     getAllInterviewReportsController,
//     generateResumePdfController
// };


// const extractText = require("../utils/extractText");
// const chunkText = require("../utils/chunkText");
// const { generateEmbeddings } = require("../utils/embedding");

// const storeResume = require("../pinecone/storeResume");
// const retrieveResume = require("../pinecone/retrieveResume");

// const {
//     generateInterviewReport,
//     generateResumePdf
// } = require("../services/ai.service");

// const interviewReportModel = require("../models/interviewReport.model");


// async function generateInterViewReportController(req, res) {
//     try {

//         // ==========================================
//         // 1. AUTHENTICATION
//         // ==========================================

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "User authentication failed. Please log in again."
//             });
//         }

//         const { selfDescription, jobDescription } = req.body;


//         // ==========================================
//         // 2. VALIDATION
//         // ==========================================

//         if (!req.file && !selfDescription?.trim()) {
//             return res.status(400).json({
//                 message: "Please upload a resume or provide a self-description."
//             });
//         }

//         if (!jobDescription?.trim()) {
//             return res.status(400).json({
//                 message: "Job description is required."
//             });
//         }


//         // ==========================================
//         // 3. EXTRACT RESUME TEXT
//         // ==========================================

//         let resumeText = "";

//         if (req.file) {
//             try {

//                 resumeText = await extractText(req.file);

//                 if (!resumeText || !resumeText.trim()) {
//                     return res.status(422).json({
//                         message:
//                             "Could not extract text from the uploaded resume."
//                     });
//                 }

//             } catch (error) {

//                 console.error(
//                     "EXTRACT_TEXT_ERROR:",
//                     error
//                 );

//                 return res.status(422).json({
//                     message:
//                         error.message ||
//                         "Failed to extract resume text."
//                 });
//             }
//         }


//         // ==========================================
//         // 4. RAG PROCESSING
//         // ==========================================

//         let relevantResume = resumeText;


//         // Only run RAG when a resume exists
//         if (resumeText) {

//             // -----------------------------
//             // Chunk resume
//             // -----------------------------

//             const chunks = await chunkText(resumeText);

//             console.log(
//                 "Total chunks:",
//                 chunks.length
//             );

//             if (chunks.length === 0) {
//                 return res.status(422).json({
//                     message:
//                         "Could not create chunks from the resume."
//                 });
//             }


//             // -----------------------------
//             // Generate embeddings
//             // -----------------------------

//             const embeddings =
//                 await generateEmbeddings(chunks);

//             console.log(
//                 "Total embeddings:",
//                 embeddings.length
//             );

//             if (!embeddings.length) {
//                 return res.status(500).json({
//                     message:
//                         "Failed to generate resume embeddings."
//                 });
//             }

//             console.log(
//                 "Embedding dimensions:",
//                 embeddings[0].length
//             );


//             // -----------------------------
//             // Store in Pinecone
//             // -----------------------------

//             await storeResume(
//                 req.user.id,
//                 chunks,
//                 embeddings
//             );

//             console.log(
//                 "Resume stored in Pinecone successfully."
//             );


//             // -----------------------------
//             // Retrieve relevant chunks
//             // -----------------------------

//             const relevantChunks =
//                 await retrieveResume(
//                     req.user.id,
//                     jobDescription
//                 );

//             console.log(
//                 "Relevant chunks:",
//                 relevantChunks.length
//             );


//             // -----------------------------
//             // Convert chunks into text
//             // -----------------------------

//             if (relevantChunks.length > 0) {

//                 relevantResume = relevantChunks
//                     .map(chunk => chunk.text)
//                     .join("\n\n");

//             } else {

//                 // Fallback to complete resume
//                 relevantResume = resumeText;
//             }


//             console.log(
//                 "RAG resume length:",
//                 relevantResume.length
//             );
//         }


//         // ==========================================
//         // 5. GENERATE AI INTERVIEW REPORT
//         // ==========================================

//         const interviewReportByAi =
//             await generateInterviewReport({

//                 resume: relevantResume,

//                 selfDescription:
//                     selfDescription || "",

//                 jobDescription
//             });


//         if (!interviewReportByAi) {
//             return res.status(500).json({
//                 message:
//                     "AI service failed to return a report."
//             });
//         }


//         // ==========================================
//         // 6. SAVE REPORT TO MONGODB
//         // ==========================================

//         const interviewReport =
//             await interviewReportModel.create({

//                 user: req.user.id,

//                 resume: resumeText,

//                 selfDescription:
//                     selfDescription || "",

//                 jobDescription,

//                 ...interviewReportByAi
//             });


//         // ==========================================
//         // 7. RESPONSE
//         // ==========================================

//         return res.status(201).json({

//             message:
//                 "Interview report generated successfully.",

//             interviewReport
//         });


//     } catch (error) {

//         console.error(
//             "GENERATE_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }



// const extractText = require("../utils/extractText");
// const chunkText = require("../utils/chunkText");
// const { generateEmbeddings } = require("../utils/embedding");

// const storeResume = require("../pinecone/storeResume");
// const retrieveResume = require("../pinecone/retrieveResume");

// const {
//     generateInterviewReport,
//     generateResumePdf
// } = require("../services/ai.service");

// const interviewReportModel = require("../models/interviewReport.model");


// // ============================================================
// // GENERATE INTERVIEW REPORT
// // ============================================================

// async function generateInterViewReportController(req, res) {
//     try {

//         // ------------------------------------------------------
//         // 1. AUTHENTICATION
//         // ------------------------------------------------------

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "User authentication failed. Please log in again."
//             });
//         }

//         const userId = req.user.id;

//         // ------------------------------------------------------
//         // 2. GET FORM DATA
//         // ------------------------------------------------------

//         const {
//             selfDescription = "",
//             jobDescription
//         } = req.body;

//         // ------------------------------------------------------
//         // 3. VALIDATION
//         // ------------------------------------------------------

//         if (!req.file && !selfDescription.trim()) {
//             return res.status(400).json({
//                 message:
//                     "Please upload a resume or provide a self-description."
//             });
//         }

//         if (!jobDescription || !jobDescription.trim()) {
//             return res.status(400).json({
//                 message: "Job description is required."
//             });
//         }

//         // ------------------------------------------------------
//         // 4. EXTRACT RESUME TEXT
//         // ------------------------------------------------------

//         let resumeText = "";

//         if (req.file) {
//             try {

//                 resumeText = await extractText(req.file);

//                 if (!resumeText || !resumeText.trim()) {
//                     return res.status(422).json({
//                         message:
//                             "Could not extract readable text from the uploaded resume."
//                     });
//                 }

//             } catch (error) {

//                 console.error(
//                     "EXTRACT_TEXT_ERROR:",
//                     error
//                 );

//                 return res.status(422).json({
//                     message:
//                         error.message ||
//                         "Failed to extract resume text."
//                 });
//             }
//         }

//         // ------------------------------------------------------
//         // 5. RAG - CHUNK RESUME
//         // ------------------------------------------------------

//         let relevantResumeText = resumeText;

//         if (resumeText) {

//             const chunks = await chunkText(resumeText);

//             console.log(
//                 "Total resume chunks:",
//                 chunks.length
//             );

//             // --------------------------------------------------
//             // 6. GENERATE EMBEDDINGS
//             // --------------------------------------------------

//             const embeddings =
//                 await generateEmbeddings(chunks);

//             console.log(
//                 "Total embeddings:",
//                 embeddings.length
//             );

//             if (
//                 embeddings.length > 0 &&
//                 embeddings[0]
//             ) {
//                 console.log(
//                     "Embedding dimensions:",
//                     embeddings[0].length
//                 );
//             }

//             // --------------------------------------------------
//             // 7. STORE RESUME IN PINECONE
//             // --------------------------------------------------

//             await storeResume(
//                 userId,
//                 chunks,
//                 embeddings
//             );

//             console.log(
//                 "Resume stored in Pinecone successfully."
//             );

//             // --------------------------------------------------
//             // 8. RETRIEVE RELEVANT RESUME CHUNKS
//             // --------------------------------------------------

//             const relevantChunks =
//                 await retrieveResume(
//                     userId,
//                     jobDescription
//                 );

//             console.log(
//                 "Relevant chunks:",
//                 relevantChunks.length
//             );

//             // --------------------------------------------------
//             // 9. COMBINE RETRIEVED CHUNKS
//             // --------------------------------------------------

//             if (relevantChunks.length > 0) {

//                 relevantResumeText =
//                     relevantChunks
//                         .map(
//                             (chunk) => chunk.text
//                         )
//                         .join("\n\n");

//             } else {

//                 // Fallback to complete resume
//                 relevantResumeText =
//                     resumeText;
//             }

//             console.log(
//                 "RAG resume context length:",
//                 relevantResumeText.length
//             );
//         }

//         // ------------------------------------------------------
//         // 10. GENERATE AI INTERVIEW REPORT
//         // ------------------------------------------------------

//         const interviewReportByAi =
//             await generateInterviewReport({

//                 // IMPORTANT:
//                 // Send RAG retrieved resume context
//                 resume: relevantResumeText,

//                 selfDescription,

//                 jobDescription
//             });

//         if (!interviewReportByAi) {
//             return res.status(500).json({
//                 message:
//                     "AI service failed to return an interview report."
//             });
//         }

//         // ------------------------------------------------------
//         // 11. SAVE REPORT TO MONGODB
//         // ------------------------------------------------------

//         const interviewReport =
//             await interviewReportModel.create({

//                 user: userId,

//                 // Store complete extracted resume
//                 // so it can be reused for PDF generation.
//                 resume: resumeText,

//                 selfDescription,

//                 jobDescription,

//                 ...interviewReportByAi
//             });

//         // ------------------------------------------------------
//         // 12. RESPONSE
//         // ------------------------------------------------------

//         return res.status(201).json({
//             message:
//                 "Interview report generated successfully.",

//             interviewReport
//         });

//     } catch (error) {

//         console.error(
//             "GENERATE_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }


// // ============================================================
// // GET SINGLE INTERVIEW REPORT
// // ============================================================

// async function getInterviewReportByIdController(
//     req,
//     res
// ) {
//     try {

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const { interviewId } = req.params;

//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewId,

//                 user: req.user.id

//             });

//         if (!interviewReport) {
//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }

//         return res.status(200).json({

//             message:
//                 "Interview report fetched successfully.",

//             interviewReport
//         });

//     } catch (error) {

//         console.error(
//             "GET_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }


// // ============================================================
// // GET ALL INTERVIEW REPORTS
// // ============================================================

// async function getAllInterviewReportsController(
//     req,
//     res
// ) {
//     try {

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const interviewReports =
//             await interviewReportModel

//                 .find({
//                     user: req.user.id
//                 })

//                 .sort({
//                     createdAt: -1
//                 })

//                 .select(
//                     "-resume " +
//                     "-selfDescription " +
//                     "-jobDescription " +
//                     "-technicalQuestions " +
//                     "-behavioralQuestions " +
//                     "-skillGaps " +
//                     "-preparationPlan " +
//                     "-__v"
//                 );

//         return res.status(200).json({

//             message:
//                 "Reports fetched successfully.",

//             interviewReports
//         });

//     } catch (error) {

//         console.error(
//             "GET_ALL_REPORTS_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }


// // ============================================================
// // GENERATE ATS-OPTIMIZED RESUME PDF
// // ============================================================

// async function generateResumePdfController(
//     req,
//     res
// ) {
//     try {

//         // ------------------------------------------------------
//         // 1. AUTHENTICATION
//         // ------------------------------------------------------

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         // ------------------------------------------------------
//         // 2. GET REPORT ID
//         // ------------------------------------------------------

//         const {
//             interviewReportId
//         } = req.params;

//         // ------------------------------------------------------
//         // 3. FIND REPORT BELONGING TO USER
//         // ------------------------------------------------------

//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewReportId,

//                 user: req.user.id

//             });

//         if (!interviewReport) {
//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }

//         // ------------------------------------------------------
//         // 4. GET STORED DATA
//         // ------------------------------------------------------

//         const {
//             resume,
//             jobDescription,
//             selfDescription
//         } = interviewReport;

//         // ------------------------------------------------------
//         // 5. VALIDATE RESUME DATA
//         // ------------------------------------------------------

//         if (
//             (!resume || !resume.trim()) &&
//             (!selfDescription ||
//                 !selfDescription.trim())
//         ) {
//             return res.status(400).json({
//                 message:
//                     "No resume or profile information is available for PDF generation."
//             });
//         }

//         // ------------------------------------------------------
//         // 6. RAG RETRIEVAL FOR PDF
//         // ------------------------------------------------------

//         let resumeContext = resume || "";

//         if (resume) {

//             try {

//                 const relevantChunks =
//                     await retrieveResume(
//                         req.user.id,
//                         jobDescription
//                     );

//                 if (
//                     relevantChunks &&
//                     relevantChunks.length > 0
//                 ) {

//                     resumeContext =
//                         relevantChunks
//                             .map(
//                                 (chunk) => chunk.text
//                             )
//                             .join("\n\n");

//                 }

//             } catch (ragError) {

//                 console.error(
//                     "PDF_RAG_ERROR:",
//                     ragError
//                 );

//                 // Don't fail PDF generation.
//                 // Use complete stored resume instead.
//                 resumeContext =
//                     resume || "";
//             }
//         }

//         // ------------------------------------------------------
//         // 7. GENERATE PDF USING AI
//         // ------------------------------------------------------

//         const pdfBuffer =
//             await generateResumePdf({

//                 resume: resumeContext,

//                 jobDescription,

//                 selfDescription
//             });

//         if (!pdfBuffer) {
//             return res.status(500).json({
//                 message:
//                     "Failed to generate resume PDF."
//             });
//         }

//         // ------------------------------------------------------
//         // 8. SEND PDF
//         // ------------------------------------------------------

//         res.set({

//             "Content-Type":
//                 "application/pdf",

//             "Content-Disposition":
//                 `attachment; filename=ATS_Resume_${interviewReportId}.pdf`,

//             "Content-Length":
//                 pdfBuffer.length

//         });

//         return res.send(pdfBuffer);

//     } catch (error) {

//         console.error(
//             "GENERATE_PDF_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Failed to generate resume PDF."
//         });
//     }
// }


// // ============================================================
// // EXPORTS
// // ============================================================

// module.exports = {

//     generateInterViewReportController,

//     getInterviewReportByIdController,

//     getAllInterviewReportsController,

//     generateResumePdfController

// };


// const extractText = require("../utils/extractText");
// const chunkText = require("../utils/chunkText");
// const { generateEmbeddings } = require("../utils/embedding");

// const storeResume = require("../pinecone/storeResume");
// const retrieveResume = require("../pinecone/retrieveResume");

// const {
//     generateInterviewReport,
//     generateResumePdf
// } = require("../services/ai.service");

// const interviewReportModel = require("../models/interviewReport.model");


// // ============================================================
// // GENERATE INTERVIEW REPORT
// // ============================================================

// async function generateInterViewReportController(req, res) {

//     try {

//         // ====================================================
//         // 1. AUTHENTICATION
//         // ====================================================

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message: "User authentication failed. Please log in again."
//             });
//         }

//         const userId = req.user.id;


//         // ====================================================
//         // 2. GET FORM DATA
//         // ====================================================

//         const {
//             selfDescription = "",
//             jobDescription
//         } = req.body;


//         // ====================================================
//         // 3. VALIDATION
//         // ====================================================

//         if (!req.file && !selfDescription.trim()) {
//             return res.status(400).json({
//                 message:
//                     "Please upload a resume or provide a self-description."
//             });
//         }

//         if (!jobDescription || !jobDescription.trim()) {
//             return res.status(400).json({
//                 message: "Job description is required."
//             });
//         }


//         // ====================================================
//         // 4. EXTRACT RESUME TEXT
//         // ====================================================

//         let resumeText = "";

//         if (req.file) {

//             try {

//                 resumeText = await extractText(req.file);

//                 if (!resumeText || !resumeText.trim()) {
//                     return res.status(422).json({
//                         message:
//                             "Could not extract readable text from the uploaded resume."
//                     });
//                 }

//             } catch (error) {

//                 console.error(
//                     "EXTRACT_TEXT_ERROR:",
//                     error
//                 );

//                 return res.status(422).json({
//                     message:
//                         error.message ||
//                         "Failed to extract resume text."
//                 });
//             }
//         }


//         // ====================================================
//         // 5. RAG CONTEXT
//         // ====================================================

//         let relevantResumeText = resumeText;


//         // Only perform RAG if a resume was uploaded
//         if (resumeText) {

//             // ------------------------------------------------
//             // CHUNK RESUME
//             // ------------------------------------------------

//             const chunks = await chunkText(resumeText);

//             console.log(
//                 "Total resume chunks:",
//                 chunks.length
//             );


//             // ------------------------------------------------
//             // GENERATE EMBEDDINGS
//             // ------------------------------------------------

//             const embeddings =
//                 await generateEmbeddings(chunks);

//             console.log(
//                 "Total embeddings:",
//                 embeddings.length
//             );

//             if (
//                 embeddings.length > 0 &&
//                 embeddings[0]
//             ) {
//                 console.log(
//                     "Embedding dimensions:",
//                     embeddings[0].length
//                 );
//             }


//             // ------------------------------------------------
//             // STORE RESUME VECTORS
//             // ------------------------------------------------

//             await storeResume(
//                 userId,
//                 chunks,
//                 embeddings
//             );

//             console.log(
//                 "Resume stored in Pinecone successfully."
//             );


//             // ------------------------------------------------
//             // RETRIEVE RELEVANT RESUME CHUNKS
//             // USING JOB DESCRIPTION AS QUERY
//             // ------------------------------------------------

//             const relevantChunks =
//                 await retrieveResume(
//                     userId,
//                     jobDescription
//                 );

//             console.log(
//                 "Relevant chunks:",
//                 relevantChunks.length
//             );


//             // ------------------------------------------------
//             // COMBINE RELEVANT CHUNKS
//             // ------------------------------------------------

//             if (
//                 relevantChunks &&
//                 relevantChunks.length > 0
//             ) {

//                 relevantResumeText =
//                     relevantChunks
//                         .map(
//                             (chunk) => chunk.text
//                         )
//                         .join("\n\n");

//             } else {

//                 // Fallback to complete resume
//                 relevantResumeText =
//                     resumeText;
//             }


//             console.log(
//                 "RAG resume context length:",
//                 relevantResumeText.length
//             );
//         }


//         // ====================================================
//         // 6. GENERATE AI INTERVIEW REPORT
//         // ====================================================

//         const interviewReportByAi =
//             await generateInterviewReport({

//                 // RAG-retrieved resume context
//                 resume: relevantResumeText,

//                 selfDescription,

//                 jobDescription
//             });


//         if (!interviewReportByAi) {

//             return res.status(500).json({
//                 message:
//                     "AI service failed to return an interview report."
//             });
//         }


//         // ====================================================
//         // 7. SAVE REPORT TO MONGODB
//         // ====================================================

//         const interviewReport =
//             await interviewReportModel.create({

//                 user: userId,

//                 // IMPORTANT:
//                 // Save COMPLETE resume.
//                 // Do not save only RAG chunks.
//                 resume: resumeText,

//                 selfDescription,

//                 jobDescription,

//                 ...interviewReportByAi
//             });


//         // ====================================================
//         // 8. SEND RESPONSE
//         // ====================================================

//         return res.status(201).json({

//             message:
//                 "Interview report generated successfully.",

//             interviewReport
//         });


//     } catch (error) {

//         console.error(
//             "GENERATE_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }



// // ============================================================
// // GET SINGLE INTERVIEW REPORT
// // ============================================================

// async function getInterviewReportByIdController(
//     req,
//     res
// ) {

//     try {

//         // Authentication
//         if (!req.user || !req.user.id) {

//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }


//         const {
//             interviewId
//         } = req.params;


//         // Find report belonging to current user
//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewId,

//                 user: req.user.id
//             });


//         if (!interviewReport) {

//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }


//         return res.status(200).json({

//             message:
//                 "Interview report fetched successfully.",

//             interviewReport
//         });


//     } catch (error) {

//         console.error(
//             "GET_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }



// // ============================================================
// // GET ALL INTERVIEW REPORTS
// // ============================================================

// async function getAllInterviewReportsController(
//     req,
//     res
// ) {

//     try {

//         if (!req.user || !req.user.id) {

//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }


//         const interviewReports =
//             await interviewReportModel
//                 .find({
//                     user: req.user.id
//                 })
//                 .sort({
//                     createdAt: -1
//                 })
//                 .select(
//                     "-resume " +
//                     "-selfDescription " +
//                     "-jobDescription " +
//                     "-technicalQuestions " +
//                     "-behavioralQuestions " +
//                     "-skillGaps " +
//                     "-preparationPlan " +
//                     "-__v"
//                 );


//         return res.status(200).json({

//             message:
//                 "Reports fetched successfully.",

//             interviewReports
//         });


//     } catch (error) {

//         console.error(
//             "GET_ALL_REPORTS_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }



// // ============================================================
// // GENERATE ATS-OPTIMIZED RESUME PDF
// // ============================================================

// async function generateResumePdfController(
//     req,
//     res
// ) {

//     try {

//         // ====================================================
//         // 1. AUTHENTICATION
//         // ====================================================

//         if (!req.user || !req.user.id) {

//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }


//         // ====================================================
//         // 2. GET REPORT ID
//         // ====================================================

//         const {
//             interviewReportId
//         } = req.params;


//         // ====================================================
//         // 3. FIND REPORT BELONGING TO USER
//         // ====================================================

//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewReportId,

//                 user: req.user.id
//             });


//         if (!interviewReport) {

//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }


//         // ====================================================
//         // 4. GET STORED INFORMATION
//         // ====================================================

//         const {
//             resume,
//             jobDescription,
//             selfDescription,
//             atsBreakdown,
//             skillGaps
//         } = interviewReport;


//         // ====================================================
//         // 5. VALIDATE RESUME DATA
//         // ====================================================

//         if (
//             (!resume || !resume.trim()) &&
//             (!selfDescription ||
//                 !selfDescription.trim())
//         ) {

//             return res.status(400).json({
//                 message:
//                     "No resume or profile information is available for PDF generation."
//             });
//         }


//         // ====================================================
//         // 6. GENERATE ATS-OPTIMIZED PDF
//         // ====================================================
//         //
//         // IMPORTANT:
//         //
//         // Do NOT retrieve only top Pinecone chunks here.
//         //
//         // A resume PDF needs the COMPLETE resume:
//         // name, email, education, skills, projects,
//         // experience, etc.
//         //
//         // RAG was already used for the interview analysis.
//         //
//         // Puppeteer will convert the AI-generated HTML
//         // into the final PDF.
//         // ====================================================

//         const pdfBuffer =
//             await generateResumePdf({

//                 resume: resume || "",

//                 jobDescription:
//                     jobDescription || "",

//                 selfDescription:
//                     selfDescription || "",

//                 atsBreakdown:
//                     atsBreakdown || {},

//                 skillGaps:
//                     skillGaps || []
//             });


//         if (!pdfBuffer) {

//             return res.status(500).json({
//                 message:
//                     "Failed to generate resume PDF."
//             });
//         }


//         // ====================================================
//         // 7. SEND PDF
//         // ====================================================

//         res.set({

//             "Content-Type":
//                 "application/pdf",

//             "Content-Disposition":
//                 `attachment; filename=ATS_Resume_${interviewReportId}.pdf`,

//             "Content-Length":
//                 pdfBuffer.length
//         });


//         return res.send(pdfBuffer);


//     } catch (error) {

//         console.error(
//             "GENERATE_PDF_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Failed to generate resume PDF."
//         });
//     }
// }



// // ============================================================
// // EXPORTS
// // ============================================================

// module.exports = {

//     generateInterViewReportController,

//     getInterviewReportByIdController,

//     getAllInterviewReportsController,

//     generateResumePdfController
// };



// const extractText = require("../utils/extractText");
// const chunkText = require("../utils/chunkText");
// const { generateEmbeddings } = require("../utils/embedding");

// const storeResume = require("../pinecone/storeResume");
// const retrieveResume = require("../pinecone/retrieveResume");

// const {
//     generateInterviewReport,
//     generateResumePdf
// } = require("../services/ai.service");

// const interviewReportModel =
//     require("../models/interviewReport.model");


// // ============================================================
// // GENERATE INTERVIEW REPORT
// // ============================================================

// async function generateInterViewReportController(req, res) {

//     try {

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 message:
//                     "User authentication failed. Please log in again."
//             });
//         }

//         const userId = req.user.id;

//         const {
//             selfDescription = "",
//             jobDescription
//         } = req.body;

//         // ------------------------------------------------------
//         // VALIDATION
//         // ------------------------------------------------------

//         if (
//             !req.file &&
//             !selfDescription.trim()
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Please upload a resume or provide a self-description."
//             });
//         }

//         if (
//             !jobDescription ||
//             !jobDescription.trim()
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Job description is required."
//             });
//         }

//         // ------------------------------------------------------
//         // EXTRACT RESUME
//         // ------------------------------------------------------

//         let resumeText = "";

//         if (req.file) {

//             try {

//                 resumeText =
//                     await extractText(req.file);

//                 if (
//                     !resumeText ||
//                     !resumeText.trim()
//                 ) {
//                     return res.status(422).json({
//                         message:
//                             "Could not extract readable text from the uploaded resume."
//                     });
//                 }

//             } catch (error) {

//                 console.error(
//                     "EXTRACT_TEXT_ERROR:",
//                     error
//                 );

//                 return res.status(422).json({
//                     message:
//                         error.message ||
//                         "Failed to extract resume text."
//                 });
//             }
//         }

//         // ------------------------------------------------------
//         // RAG
//         // ------------------------------------------------------

//         let relevantResumeText =
//             resumeText;

//         if (resumeText) {

//             const chunks =
//                 await chunkText(resumeText);

//             console.log(
//                 "Total resume chunks:",
//                 chunks.length
//             );

//             if (chunks.length > 0) {

//                 const embeddings =
//                     await generateEmbeddings(chunks);

//                 console.log(
//                     "Total embeddings:",
//                     embeddings.length
//                 );

//                 await storeResume(
//                     userId,
//                     chunks,
//                     embeddings
//                 );

//                 console.log(
//                     "Resume stored in Pinecone successfully."
//                 );

//                 const relevantChunks =
//                     await retrieveResume(
//                         userId,
//                         jobDescription
//                     );

//                 console.log(
//                     "Relevant chunks:",
//                     relevantChunks?.length || 0
//                 );

//                 if (
//                     relevantChunks &&
//                     relevantChunks.length > 0
//                 ) {

//                     relevantResumeText =
//                         relevantChunks
//                             .map(chunk => {

//                                 if (
//                                     typeof chunk === "string"
//                                 ) {
//                                     return chunk;
//                                 }

//                                 return chunk.text || "";
//                             })
//                             .filter(Boolean)
//                             .join("\n\n");
//                 }
//             }
//         }

//         // ------------------------------------------------------
//         // AI REPORT
//         // ------------------------------------------------------

//         const interviewReportByAi =
//             await generateInterviewReport({

//                 resume:
//                     relevantResumeText,

//                 selfDescription,

//                 jobDescription
//             });

//         if (!interviewReportByAi) {

//             return res.status(500).json({
//                 message:
//                     "AI service failed to return an interview report."
//             });
//         }

//         // ------------------------------------------------------
//         // SAVE COMPLETE RESUME
//         // ------------------------------------------------------

//         const interviewReport =
//             await interviewReportModel.create({

//                 user: userId,

//                 resume: resumeText,

//                 selfDescription,

//                 jobDescription,

//                 ...interviewReportByAi
//             });

//         return res.status(201).json({

//             message:
//                 "Interview report generated successfully.",

//             interviewReport
//         });

//     } catch (error) {

//         console.error(
//             "GENERATE_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error. The AI analysis might have timed out."
//         });
//     }
// }


// // ============================================================
// // GET SINGLE REPORT
// // ============================================================

// async function getInterviewReportByIdController(
//     req,
//     res
// ) {

//     try {

//         if (
//             !req.user ||
//             !req.user.id
//         ) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const {
//             interviewId
//         } = req.params;

//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewId,

//                 user: req.user.id

//             });

//         if (!interviewReport) {

//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }

//         return res.status(200).json({

//             message:
//                 "Interview report fetched successfully.",

//             interviewReport
//         });

//     } catch (error) {

//         console.error(
//             "GET_REPORT_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }


// // ============================================================
// // GET ALL REPORTS
// // ============================================================

// async function getAllInterviewReportsController(
//     req,
//     res
// ) {

//     try {

//         if (
//             !req.user ||
//             !req.user.id
//         ) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const interviewReports =
//             await interviewReportModel
//                 .find({
//                     user: req.user.id
//                 })
//                 .sort({
//                     createdAt: -1
//                 })
//                 .select(
//                     "-resume " +
//                     "-selfDescription " +
//                     "-jobDescription " +
//                     "-technicalQuestions " +
//                     "-behavioralQuestions " +
//                     "-skillGaps " +
//                     "-preparationPlan " +
//                     "-__v"
//                 );

//         return res.status(200).json({

//             message:
//                 "Reports fetched successfully.",

//             interviewReports
//         });

//     } catch (error) {

//         console.error(
//             "GET_ALL_REPORTS_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Internal server error"
//         });
//     }
// }


// // ============================================================
// // GENERATE ATS RESUME PDF
// // ============================================================

// async function generateResumePdfController(
//     req,
//     res
// ) {

//     try {

//         // ------------------------------------------------------
//         // AUTH
//         // ------------------------------------------------------

//         if (
//             !req.user ||
//             !req.user.id
//         ) {
//             return res.status(401).json({
//                 message: "Unauthorized"
//             });
//         }

//         const {
//             interviewReportId
//         } = req.params;

//         // ------------------------------------------------------
//         // FIND USER'S REPORT
//         // ------------------------------------------------------

//         const interviewReport =
//             await interviewReportModel.findOne({

//                 _id: interviewReportId,

//                 user: req.user.id

//             });

//         if (!interviewReport) {

//             return res.status(404).json({
//                 message:
//                     "Interview report not found."
//             });
//         }

//         const {
//             resume,
//             jobDescription,
//             selfDescription
//         } = interviewReport;

//         // ------------------------------------------------------
//         // VALIDATE DATA
//         // ------------------------------------------------------

//         if (
//             (!resume || !resume.trim()) &&
//             (!selfDescription ||
//                 !selfDescription.trim())
//         ) {

//             return res.status(400).json({
//                 message:
//                     "No resume or profile information is available for PDF generation."
//             });
//         }

//         // ------------------------------------------------------
//         // RAG CONTEXT FOR PDF
//         // ------------------------------------------------------

//         let relevantResumeContext = "";

//         if (resume && jobDescription) {

//             try {

//                 const relevantChunks =
//                     await retrieveResume(
//                         req.user.id,
//                         jobDescription
//                     );

//                 if (
//                     relevantChunks &&
//                     relevantChunks.length > 0
//                 ) {

//                     relevantResumeContext =
//                         relevantChunks
//                             .map(chunk => {

//                                 if (
//                                     typeof chunk === "string"
//                                 ) {
//                                     return chunk;
//                                 }

//                                 return chunk.text || "";
//                             })
//                             .filter(Boolean)
//                             .join("\n\n");
//                 }

//             } catch (ragError) {

//                 console.error(
//                     "PDF_RAG_ERROR:",
//                     ragError
//                 );

//                 relevantResumeContext = "";
//             }
//         }

//         // ------------------------------------------------------
//         // GENERATE PDF
//         // ------------------------------------------------------

//         const pdfBuffer =
//             await generateResumePdf({

//                 resume,

//                 relevantResumeContext,

//                 jobDescription,

//                 selfDescription
//             });

//         if (
//             !pdfBuffer ||
//             !Buffer.isBuffer(pdfBuffer)
//         ) {

//             throw new Error(
//                 "PDF service did not return a valid PDF buffer."
//             );
//         }

//         console.log(
//             "PDF generated successfully:",
//             pdfBuffer.length,
//             "bytes"
//         );

//         // ------------------------------------------------------
//         // SEND PDF
//         // ------------------------------------------------------

//         res.status(200);

//         res.set({

//             "Content-Type":
//                 "application/pdf",

//             "Content-Disposition":
//                 `attachment; filename="ATS_Resume_${interviewReportId}.pdf"`,

//             "Content-Length":
//                 pdfBuffer.length,

//             "Cache-Control":
//                 "no-store"

//         });

//         return res.end(pdfBuffer);

//     } catch (error) {

//         console.error(
//             "GENERATE_PDF_ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 error.message ||
//                 "Failed to generate resume PDF."
//         });
//     }
// }


// // ============================================================
// // EXPORTS
// // ============================================================

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

const interviewReportModel =
    require("../models/interviewReport.model");


// ============================================================
// GENERATE INTERVIEW REPORT
// ============================================================

async function generateInterViewReportController(req, res) {

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message:
                    "User authentication failed. Please log in again."
            });
        }

        const userId = req.user.id;

        const {
            selfDescription = "",
            jobDescription
        } = req.body;

        // ------------------------------------------------------
        // VALIDATION
        // ------------------------------------------------------

        if (
            !req.file &&
            !selfDescription.trim()
        ) {
            return res.status(400).json({
                message:
                    "Please upload a resume or provide a self-description."
            });
        }

        if (
            !jobDescription ||
            !jobDescription.trim()
        ) {
            return res.status(400).json({
                message:
                    "Job description is required."
            });
        }

        // ------------------------------------------------------
        // EXTRACT RESUME
        // ------------------------------------------------------

        let resumeText = "";

        if (req.file) {

            try {

                resumeText =
                    await extractText(req.file);

                if (
                    !resumeText ||
                    !resumeText.trim()
                ) {
                    return res.status(422).json({
                        message:
                            "Could not extract readable text from the uploaded resume."
                    });
                }

            } catch (error) {

                console.error(
                    "EXTRACT_TEXT_ERROR:",
                    error
                );

                return res.status(422).json({
                    message:
                        error.message ||
                        "Failed to extract resume text."
                });
            }
        }

        // ------------------------------------------------------
        // RAG
        // ------------------------------------------------------

        let relevantResumeText =
            resumeText;

        if (resumeText) {

            const chunks =
                await chunkText(resumeText);

            console.log(
                "Total resume chunks:",
                chunks.length
            );

            if (chunks.length > 0) {

                const embeddings =
                    await generateEmbeddings(chunks);

                console.log(
                    "Total embeddings:",
                    embeddings.length
                );

                await storeResume(
                    userId,
                    chunks,
                    embeddings
                );

                console.log(
                    "Resume stored in Pinecone successfully."
                );

                const relevantChunks =
                    await retrieveResume(
                        userId,
                        jobDescription
                    );

                console.log(
                    "Relevant chunks:",
                    relevantChunks?.length || 0
                );

                if (
                    relevantChunks &&
                    relevantChunks.length > 0
                ) {

                    relevantResumeText =
                        relevantChunks
                            .map(chunk => {

                                if (
                                    typeof chunk === "string"
                                ) {
                                    return chunk;
                                }

                                return chunk.text || "";
                            })
                            .filter(Boolean)
                            .join("\n\n");
                }
            }
        }

        // ------------------------------------------------------
        // AI REPORT
        // ------------------------------------------------------

        const interviewReportByAi =
            await generateInterviewReport({

                resume:
                    relevantResumeText,

                selfDescription,

                jobDescription
            });

        if (!interviewReportByAi) {

            return res.status(500).json({
                message:
                    "AI service failed to return an interview report."
            });
        }

        // ------------------------------------------------------
        // TEMP DEBUG — remove after diagnosing
        // ------------------------------------------------------

        console.log(
            "DEBUG atsBreakdown FROM AI:",
            JSON.stringify(interviewReportByAi.atsBreakdown, null, 2)
        );

        // ------------------------------------------------------
        // SAVE COMPLETE RESUME
        // ------------------------------------------------------

        const interviewReport =
            await interviewReportModel.create({

                user: userId,

                resume: resumeText,

                selfDescription,

                jobDescription,

                ...interviewReportByAi
            });

        return res.status(201).json({

            message:
                "Interview report generated successfully.",

            interviewReport
        });

    } catch (error) {

        console.error(
            "GENERATE_REPORT_ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error. The AI analysis might have timed out."
        });
    }
}


// ============================================================
// GET SINGLE REPORT
// ============================================================

async function getInterviewReportByIdController(
    req,
    res
) {

    try {

        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const {
            interviewId
        } = req.params;

        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });

        if (!interviewReport) {

            return res.status(404).json({
                message:
                    "Interview report not found."
            });
        }

        return res.status(200).json({

            message:
                "Interview report fetched successfully.",

            interviewReport
        });

    } catch (error) {

        console.error(
            "GET_REPORT_ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error"
        });
    }
}


// ============================================================
// GET ALL REPORTS
// ============================================================

async function getAllInterviewReportsController(
    req,
    res
) {

    try {

        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const interviewReports =
            await interviewReportModel
                .find({
                    user: req.user.id
                })
                .sort({
                    createdAt: -1
                })
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

            message:
                "Reports fetched successfully.",

            interviewReports
        });

    } catch (error) {

        console.error(
            "GET_ALL_REPORTS_ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Internal server error"
        });
    }
}


// ============================================================
// GENERATE ATS RESUME PDF
// ============================================================

async function generateResumePdfController(
    req,
    res
) {

    try {

        // ------------------------------------------------------
        // AUTH
        // ------------------------------------------------------

        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const {
            interviewReportId
        } = req.params;

        // ------------------------------------------------------
        // FIND USER'S REPORT
        // ------------------------------------------------------

        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewReportId,

                user: req.user.id

            });

        if (!interviewReport) {

            return res.status(404).json({
                message:
                    "Interview report not found."
            });
        }

        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;

        // ------------------------------------------------------
        // VALIDATE DATA
        // ------------------------------------------------------

        if (
            (!resume || !resume.trim()) &&
            (!selfDescription ||
                !selfDescription.trim())
        ) {

            return res.status(400).json({
                message:
                    "No resume or profile information is available for PDF generation."
            });
        }

        // ------------------------------------------------------
        // RAG CONTEXT FOR PDF
        // ------------------------------------------------------

        let relevantResumeContext = "";

        if (resume && jobDescription) {

            try {

                const relevantChunks =
                    await retrieveResume(
                        req.user.id,
                        jobDescription
                    );

                if (
                    relevantChunks &&
                    relevantChunks.length > 0
                ) {

                    relevantResumeContext =
                        relevantChunks
                            .map(chunk => {

                                if (
                                    typeof chunk === "string"
                                ) {
                                    return chunk;
                                }

                                return chunk.text || "";
                            })
                            .filter(Boolean)
                            .join("\n\n");
                }

            } catch (ragError) {

                console.error(
                    "PDF_RAG_ERROR:",
                    ragError
                );

                relevantResumeContext = "";
            }
        }

        // ------------------------------------------------------
        // GENERATE PDF
        // ------------------------------------------------------

        const pdfBuffer =
            await generateResumePdf({

                resume,

                relevantResumeContext,

                jobDescription,

                selfDescription
            });

        if (
            !pdfBuffer ||
            !Buffer.isBuffer(pdfBuffer)
        ) {

            throw new Error(
                "PDF service did not return a valid PDF buffer."
            );
        }

        console.log(
            "PDF generated successfully:",
            pdfBuffer.length,
            "bytes"
        );

        // ------------------------------------------------------
        // SEND PDF
        // ------------------------------------------------------

        res.status(200);

        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename="ATS_Resume_${interviewReportId}.pdf"`,

            "Content-Length":
                pdfBuffer.length,

            "Cache-Control":
                "no-store"

        });

        return res.end(pdfBuffer);

    } catch (error) {

        console.error(
            "GENERATE_PDF_ERROR:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to generate resume PDF."
        });
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    generateInterViewReportController,

    getInterviewReportByIdController,

    getAllInterviewReportsController,

    generateResumePdfController

};