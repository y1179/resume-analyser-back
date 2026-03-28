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


const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        // ✅ Validation
        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Please upload resume or provide self description"
            });
        }

        let resumeText = "";

        // ✅ If resume exists → parse PDF
        if (req.file) {
            try {
                const resumeContent = await pdfParse(req.file.buffer);
                resumeText = resumeContent.text;
            } catch (err) {
                return res.status(422).json({ message: "Failed to parse PDF file." });
            }
        }

        // ✅ Call AI
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // ✅ Save in DB - FIXED: using req.user.id instead of req.user
        const interviewReport = await interviewReportModel.create({
            user: req.user.id, 
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("GENERATE_REPORT_ERROR:", error);
        res.status(500).json({
            message: "Internal server error while generating report"
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
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

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("GET_REPORT_ERROR:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        console.error("GET_ALL_REPORTS_ERROR:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
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