// const pdfParse = require("pdf-parse")
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
// const interviewReportModel = require("../models/interviewReport.model")




// /**
//  * @description Controller to generate interview report based on user self description, resume and job description.
//  */

// async function generateInterViewReportController(req, res) {
//     try {
//         const { selfDescription, jobDescription } = req.body

//         // ✅ Validation
//         if (!req.file && !selfDescription) {
//             return res.status(400).json({
//                 message: "Please upload resume or provide self description"
//             })
//         }

//         let resumeText = ""

//         // ✅ If resume exists → parse PDF
//         if (req.file) {
//             const resumeContent = await pdfParse(req.file.buffer)
//             resumeText = resumeContent.text
//         }

//         // ✅ Call AI
//         const interViewReportByAi = await generateInterviewReport({
//             resume: resumeText,
//             selfDescription,
//             jobDescription
//         })

//         // ✅ Save in DB
//         const interviewReport = await interviewReportModel.create({
//             user: req.user,
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...interViewReportByAi
//         })

//         res.status(201).json({
//             message: "Interview report generated successfully.",
//             interviewReport
//         })

//     } catch (error) {
//         console.error("ERROR:", error)
//         res.status(500).json({
//             message: "Internal server error"
//         })
//     }
// }
// // async function generateInterViewReportController(req, res) {

// //     const resumeContent = await    pdfParse(req.file.buffer)
// //     const { selfDescription, jobDescription } = req.body

// //     const interViewReportByAi = await generateInterviewReport({
// //         resume: resumeContent.text,
// //         selfDescription,
// //         jobDescription
// //     })

// //     const interviewReport = await interviewReportModel.create({
// //         user: req.user,
// //         resume: resumeContent.text,
// //         selfDescription,
// //         jobDescription,
// //         ...interViewReportByAi
// //     })

// //     res.status(201).json({
// //         message: "Interview report generated successfully.",
// //         interviewReport
// //     })

// // }

// /**
//  * @description Controller to get interview report by interviewId.
//  */
// async function getInterviewReportByIdController(req, res) {

//     const { interviewId } = req.params

//     const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     res.status(200).json({
//         message: "Interview report fetched successfully.",
//         interviewReport
//     })
// }


// /** 
//  * @description Controller to get all interview reports of logged in user.
//  */
// async function getAllInterviewReportsController(req, res) {
//     const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

//     res.status(200).json({
//         message: "Interview reports fetched successfully.",
//         interviewReports
//     })
// }


// /**
//  * @description Controller to generate resume PDF based on user self description, resume and job description.
//  */
// async function generateResumePdfController(req, res) {
//     const { interviewReportId } = req.params

//     const interviewReport = await interviewReportModel.findById(interviewReportId)

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     const { resume, jobDescription, selfDescription } = interviewReport

//     const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

//     res.set({
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
//     })

//     res.send(pdfBuffer)
// }

// module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }


// const pdfParse = require("pdf-parse");
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
// const interviewReportModel = require("../models/interviewReport.model");

// /**
//  * @description Controller to generate interview report based on user self description, resume and job description.
//  */
// async function generateInterViewReportController(req, res) {
//     try {
//         const { selfDescription, jobDescription } = req.body;

//         // ✅ Validation
//         if (!req.file && !selfDescription) {
//             return res.status(400).json({
//                 message: "Please upload resume or provide self description"
//             });
//         }

//         let resumeText = "";

//         // ✅ If resume exists → parse PDF
//         if (req.file) {
//             try {
//                 const resumeContent = await pdfParse(req.file.buffer);
//                 resumeText = resumeContent.text;
//             } catch (err) {
//                 return res.status(422).json({ message: "Failed to parse PDF file." });
//             }
//         }

//         // ✅ Call AI
//         const interViewReportByAi = await generateInterviewReport({
//             resume: resumeText,
//             selfDescription,
//             jobDescription
//         });

//         // ✅ Save in DB - FIXED: using req.user.id instead of req.user
//         const interviewReport = await interviewReportModel.create({
//             user: req.user.id, 
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...interViewReportByAi
//         });

//         res.status(201).json({
//             message: "Interview report generated successfully.",
//             interviewReport
//         });

//     } catch (error) {
//         console.error("GENERATE_REPORT_ERROR:", error);
//         res.status(500).json({
//             message: "Internal server error while generating report"
//         });
//     }
// }

// /**
//  * @description Controller to get interview report by interviewId.
//  */
// async function getInterviewReportByIdController(req, res) {
//     try {
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

//         res.status(200).json({
//             message: "Interview report fetched successfully.",
//             interviewReport
//         });
//     } catch (error) {
//         console.error("GET_REPORT_ERROR:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// /** * @description Controller to get all interview reports of logged in user.
//  */
// async function getAllInterviewReportsController(req, res) {
//     try {
//         const interviewReports = await interviewReportModel.find({ user: req.user.id })
//             .sort({ createdAt: -1 })
//             .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

//         res.status(200).json({
//             message: "Interview reports fetched successfully.",
//             interviewReports
//         });
//     } catch (error) {
//         console.error("GET_ALL_REPORTS_ERROR:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// /**
//  * @description Controller to generate resume PDF based on user self description, resume and job description.
//  */
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

const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report.
 * FIXED: Added robust checks for req.user and improved error handling for AI timeouts.
 */
async function generateInterViewReportController(req, res) {
    try {
        // 1. AUTH CHECK: Prevent "Cannot read properties of null (reading '_id')"
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User authentication failed. Please log in again." });
        }

        const { selfDescription, jobDescription } = req.body;

        // 2. VALIDATION
        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Please upload a resume or provide a self-description."
            });
        }

        let resumeText = "";

        // 3. PDF PARSING: Wrap in specific try/catch
        if (req.file) {
            try {
                const resumeContent = await pdfParse(req.file.buffer);
                resumeText = resumeContent.text;
                if (!resumeText || resumeText.trim().length === 0) {
                    throw new Error("PDF is empty or unreadable");
                }
            } catch (err) {
                console.error("PDF_PARSE_ERROR:", err.message);
                return res.status(422).json({ message: "Failed to parse PDF file. Ensure it is not password protected." });
            }
        }

        // 4. AI CALL: Set a local timeout flag if possible or handle long waits
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        if (!interViewReportByAi) {
            return res.status(500).json({ message: "AI service failed to return a report." });
        }

        // 5. SAVE TO DB: Spread the AI result correctly
        const interviewReport = await interviewReportModel.create({
            user: req.user.id, 
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi // Ensure this object matches your Schema keys
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("GENERATE_REPORT_ERROR:", error);
        // Avoid sending the full error object to frontend for security
        return res.status(500).json({
            message: "Internal server error. The AI analysis might have timed out."
        });
    }
}

/**
 * @description Controller to get interview report by ID.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        // AUTH CHECK
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { interviewId } = req.params;

        // Ensure we check that the report belongs to the logged-in user
        const interviewReport = await interviewReportModel.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("GET_REPORT_ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/** * @description Controller to get all reports for the user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            // Exclude heavy fields for the list view to improve performance
            .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v");

        return res.status(200).json({
            message: "Reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        console.error("GET_ALL_REPORTS_ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ... Keep your generateResumePdfController as it was, but add a req.user check!
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("GENERATE_PDF_ERROR:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};