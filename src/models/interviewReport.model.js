


const mongoose = require("mongoose");

// ============================================================
// ATS BREAKDOWN SCHEMA
// ============================================================

const atsBreakdownSchema = new mongoose.Schema(
    {
        skillsMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, "Skills match score is required"],
        },

        experienceMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, "Experience match score is required"],
        },

        keywordMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, "Keyword match score is required"],
        },

        educationMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, "Education match score is required"],
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// TECHNICAL QUESTION SCHEMA
// ============================================================

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Technical question is required"],
            trim: true,
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
            trim: true,
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// BEHAVIORAL QUESTION SCHEMA
// ============================================================

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Behavioral question is required"],
            trim: true,
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
            trim: true,
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// SKILL GAP SCHEMA
// ============================================================

const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "Skill is required"],
            trim: true,
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Severity is required"],
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// PREPARATION PLAN SCHEMA
// ============================================================

const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "Day is required"],
            min: 1,
        },

        focus: {
            type: String,
            required: [true, "Focus is required"],
            trim: true,
        },

        tasks: {
            type: [String],
            required: [true, "Tasks are required"],
            default: [],
        },
    },
    {
        _id: false,
    }
);


// ============================================================
// MAIN INTERVIEW REPORT SCHEMA
// ============================================================

const interviewReportSchema = new mongoose.Schema(
    {
        // ====================================================
        // USER
        // ====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "User is required"],
            index: true,
        },


        // ====================================================
        // JOB INFORMATION
        // ====================================================

        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },

        jobDescription: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },


        // ====================================================
        // CANDIDATE INFORMATION
        // ====================================================

        // Complete extracted resume.
        //
        // Important:
        // Store the COMPLETE resume here.
        // Pinecone stores the chunks for RAG,
        // while MongoDB keeps the original extracted text
        // for report history and PDF generation.

        resume: {
            type: String,
            trim: true,
            default: "",
        },

        selfDescription: {
            type: String,
            trim: true,
            default: "",
        },


        // ====================================================
        // OVERALL ATS MATCH SCORE
        // ====================================================

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
            required: [true, "Match score is required"],
        },


        // ====================================================
        // ATS SCORE BREAKDOWN
        // ====================================================

        atsBreakdown: {
            type: atsBreakdownSchema,
            required: [true, "ATS breakdown is required"],
        },


        // ====================================================
        // TECHNICAL QUESTIONS
        // ====================================================

        technicalQuestions: {
            type: [technicalQuestionSchema],
            default: [],
        },


        // ====================================================
        // BEHAVIORAL QUESTIONS
        // ====================================================

        behavioralQuestions: {
            type: [behavioralQuestionSchema],
            default: [],
        },


        // ====================================================
        // SKILL GAPS
        // ====================================================

        skillGaps: {
            type: [skillGapSchema],
            default: [],
        },


        // ====================================================
        // PREPARATION ROADMAP
        // ====================================================

        preparationPlan: {
            type: [preparationPlanSchema],
            default: [],
        },
    },


    // ========================================================
    // TIMESTAMPS
    // ========================================================

    {
        timestamps: true,
    }
);


// ============================================================
// MODEL
// ============================================================

const interviewReportModel = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);


module.exports = interviewReportModel;