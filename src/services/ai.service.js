// const Groq = require("groq-sdk"); // ✅ correct import
// const { z } = require("zod");

// // Initialize Groq
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY, // ✅ correct env variable
// });

// // Schema
// const interviewReportSchema = z.object({
//   matchScore: z.number(),
//   technicalQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     })
//   ),
//   behavioralQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     })
//   ),
//   skillGaps: z.array(
//     z.object({
//       skill: z.string(),
//       severity: z.enum(["low", "medium", "high"]),
//     })
//   ),
//   preparationPlan: z.array(
//     z.object({
//       day: z.number(),
//       focus: z.string(),
//       tasks: z.array(z.string()),
//     })
//   ),
//   title: z.string(),
// });

// // MAIN FUNCTION
// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   try {
//     const prompt = `
// You are an expert technical interviewer.

// Return ONLY valid JSON. No explanation.

// STRICT RULES:
// - Do NOT return empty arrays
// - Generate at least:
//   - 5 technicalQuestions
//   - 5 behavioralQuestions
//   - 5 skillGaps
//   - 5 days preparationPlan
// - matchScore should be between 0–100

// Return JSON in this exact structure:
// {
//   "matchScore": number,
//   "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
//   "preparationPlan": [{ "day": number, "focus": "", "tasks": [] }],
//   "title": ""
// }

// Candidate Resume:
// ${resume}

// Self Description:
// ${selfDescription}

// Job Description:
// ${jobDescription}
// `;

//     const response = await groq.chat.completions.create({
//       model:  "llama-3.1-8b-instant", // ✅ free + fast
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//     });

//     const text = response.choices[0].message.content;

//     // ✅ Safety check
//     if (!text || !text.trim().startsWith("{")) {
//       console.error("❌ Invalid AI Response:", text);
//       throw new Error("AI did not return valid JSON");
//     }

//     // ✅ Parse JSON
//     const data = JSON.parse(text);

//     // ✅ Validate with Zod
//     const validated = interviewReportSchema.parse(data);

//     return validated;
//   } catch (error) {
//     console.error("AI SERVICE ERROR:", error.message);
//     throw error;
//   }
// }

// module.exports = { generateInterviewReport };


// const Groq = require("groq-sdk");
// const { z } = require("zod");
// const puppeteer = require("puppeteer");

// // ======================================================
// // GROQ INITIALIZATION
// // ======================================================

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
// });


// // ======================================================
// // ZOD SCHEMA
// // ======================================================

// const interviewReportSchema = z.object({

//     matchScore: z.coerce.number().min(0).max(100),

//     atsBreakdown: z.object({
//         skillsMatch: z.coerce.number().min(0).max(100),
//         experienceMatch: z.coerce.number().min(0).max(100),
//         keywordMatch: z.coerce.number().min(0).max(100),
//         educationMatch: z.coerce.number().min(0).max(100),
//     }),

//     technicalQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string(),
//         })
//     ).default([]),

//     behavioralQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string(),
//         })
//     ).default([]),

//     skillGaps: z.array(
//         z.object({
//             skill: z.string(),
//             severity: z.enum(["low", "medium", "high"]),
//         })
//     ).default([]),

//     preparationPlan: z.array(
//         z.object({
//             day: z.coerce.number(),
//             focus: z.string(),
//             tasks: z.array(z.string()).default([]),
//         })
//     ).default([]),

//     title: z.string(),
// });


// // ======================================================
// // EXTRACT JSON
// // ======================================================

// function extractJson(text) {

//     if (!text) {
//         throw new Error("Empty AI response");
//     }

//     const stripped = text
//         .replace(/```json/gi, "")
//         .replace(/```/g, "")
//         .trim();

//     const start = stripped.indexOf("{");
//     const end = stripped.lastIndexOf("}");

//     if (
//         start === -1 ||
//         end === -1 ||
//         end <= start
//     ) {
//         throw new Error(
//             "No valid JSON object found in AI response"
//         );
//     }

//     return stripped.slice(start, end + 1);
// }


// // ======================================================
// // GROQ WITH RETRY
// // ======================================================
// //
// // NOTE: "llama-3.3-70b-versatile" was deprecated by Groq
// // (announced June 17, 2026) and is no longer served on
// // free/developer-tier keys. Using it causes every call to
// // fail with a "model_decommissioned" error, which is what
// // was breaking both report generation and PDF generation.
// //
// // Default model updated to Groq's recommended replacement.
// // ======================================================

// async function callGroqWithRetry(
//     messages,
//     options = {},
//     maxRetries = 2
// ) {

//     const {
//         model = "openai/gpt-oss-120b",
//         temperature = 0.2,
//         max_tokens = 4000,
//     } = options;

//     let lastError;

//     for (
//         let attempt = 1;
//         attempt <= maxRetries;
//         attempt++
//     ) {

//         try {

//             const response =
//                 await groq.chat.completions.create({

//                     model,

//                     messages,

//                     temperature,

//                     max_tokens,
//                 });

//             const text =
//                 response?.choices?.[0]?.message?.content;

//             if (
//                 !text ||
//                 !text.trim()
//             ) {
//                 throw new Error(
//                     "Empty response from Groq"
//                 );
//             }

//             return text;

//         } catch (error) {

//             console.error(
//                 `Groq attempt ${attempt} failed:`,
//                 error.message
//             );

//             lastError = error;

//             if (attempt < maxRetries) {

//                 await new Promise(
//                     resolve =>
//                         setTimeout(
//                             resolve,
//                             1500
//                         )
//                 );
//             }
//         }
//     }

//     throw lastError;
// }


// // ======================================================
// // GENERATE INTERVIEW REPORT
// // ======================================================

// async function generateInterviewReport({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {

//     try {

//         const prompt = `
// You are an ATS resume analyzer helping a fresher.

// Analyze the candidate profile against the target job description.

// Return ONLY valid JSON.

// Do not return markdown.
// Do not return code fences.
// Do not add explanations.

// Rules:

// 1. matchScore must be 0-100.

// 2. atsBreakdown must contain:
//    skillsMatch
//    experienceMatch
//    keywordMatch
//    educationMatch

// 3. Do not invent experience, skills,
//    education or projects.

// 4. Projects can count as relevant experience
//    for a fresher.

// 5. skillGaps should contain skills clearly
//    required by the job but missing or weak
//    in the candidate profile.

// 6. Generate exactly 5 technical questions.

// 7. Generate exactly 4 behavioral questions.

// 8. Generate a practical 7-day preparation plan.

// 9. title must represent the target job role.

// JSON structure:

// {
//   "matchScore": 0,
//   "atsBreakdown": {
//     "skillsMatch": 0,
//     "experienceMatch": 0,
//     "keywordMatch": 0,
//     "educationMatch": 0
//   },
//   "technicalQuestions": [
//     {
//       "question": "",
//       "intention": "",
//       "answer": ""
//     }
//   ],
//   "behavioralQuestions": [
//     {
//       "question": "",
//       "intention": "",
//       "answer": ""
//     }
//   ],
//   "skillGaps": [
//     {
//       "skill": "",
//       "severity": "low"
//     }
//   ],
//   "preparationPlan": [
//     {
//       "day": 1,
//       "focus": "",
//       "tasks": [
//         ""
//       ]
//     }
//   ],
//   "title": ""
// }

// ========================
// CANDIDATE RESUME
// ========================

// ${resume || "No resume provided."}

// ========================
// SELF DESCRIPTION
// ========================

// ${selfDescription || "No self description provided."}

// ========================
// TARGET JOB DESCRIPTION
// ========================

// ${jobDescription}
// `;

//         const messages = [

//             {
//                 role: "system",

//                 content:
//                     "You are an ATS analyzer. Return ONLY valid JSON.",
//             },

//             {
//                 role: "user",

//                 content: prompt,
//             },

//         ];

//         const text =
//             await callGroqWithRetry(
//                 messages,
//                 {
//                     model:
//                         "openai/gpt-oss-120b",

//                     temperature: 0.2,

//                     max_tokens: 4000,
//                 }
//             );

//         const cleanJson =
//             extractJson(text);

//         let data;

//         try {

//             data =
//                 JSON.parse(cleanJson);

//         } catch (error) {

//             console.error(
//                 "JSON PARSE ERROR:",
//                 error.message
//             );

//             throw new Error(
//                 "AI returned malformed JSON"
//             );
//         }

//         if (
//             Array.isArray(
//                 data.preparationPlan
//             )
//         ) {

//             data.preparationPlan =
//                 data.preparationPlan.map(
//                     day => ({

//                         ...day,

//                         tasks:
//                             (day.tasks || [])
//                                 .map(task =>
//                                     typeof task === "string"
//                                         ? task
//                                         : JSON.stringify(task)
//                                 ),

//                     })
//                 );
//         }

//         const validated =
//             interviewReportSchema.parse(data);

//         validated.matchScore =
//             Math.min(
//                 100,
//                 Math.max(
//                     0,
//                     validated.matchScore
//                 )
//             );

//         return validated;

//     } catch (error) {

//         console.error(
//             "AI SERVICE ERROR:",
//             error.message
//         );

//         throw error;
//     }
// }


// // ======================================================
// // GENERATE PDF FROM HTML
// // ======================================================

// async function generatePdfFromHtml(htmlContent) {

//     let browser;

//     try {

//         browser =
//             await puppeteer.launch({

//                 headless: true,

//                 args: [
//                     "--no-sandbox",
//                     "--disable-setuid-sandbox",
//                     "--disable-dev-shm-usage",
//                     "--disable-gpu",
//                 ],

//             });

//         const page =
//             await browser.newPage();

//         await page.setViewport({

//             width: 1200,

//             height: 1600,

//             deviceScaleFactor: 1,

//         });

//         await page.setContent(
//             htmlContent,
//             {
//                 waitUntil:
//                     "domcontentloaded",

//                 timeout: 30000,
//             }
//         );

//         await page.emulateMediaType("print");

//         await page.evaluate(
//             async () => {

//                 if (document.fonts) {
//                     await document.fonts.ready;
//                 }

//             }
//         );

//         const pdfBuffer =
//             await page.pdf({

//                 format: "A4",

//                 printBackground: true,

//                 preferCSSPageSize: true,

//                 margin: {

//                     top: "12mm",

//                     bottom: "12mm",

//                     left: "12mm",

//                     right: "12mm",

//                 },

//                 timeout: 60000,

//             });

//         if (
//             !pdfBuffer ||
//             pdfBuffer.length === 0
//         ) {

//             throw new Error(
//                 "Puppeteer returned an empty PDF."
//             );
//         }

//         console.log(
//             "Puppeteer PDF size:",
//             pdfBuffer.length
//         );

//         return pdfBuffer;

//     } catch (error) {

//         console.error(
//             "PUPPETEER PDF ERROR:",
//             error.message
//         );

//         throw new Error(
//             `PDF generation failed: ${error.message}`
//         );

//     } finally {

//         if (browser) {

//             try {

//                 await browser.close();

//             } catch (error) {

//                 console.error(
//                     "Browser close error:",
//                     error.message
//                 );
//             }
//         }
//     }
// }


// // ======================================================
// // GENERATE RESUME PDF
// // ======================================================
// // FIX: this now accepts `relevantResumeContext` (already
// // sent by the controller after RAG retrieval) and prefers
// // it over the raw `resume` text when available, instead of
// // silently ignoring it like before.
// // ======================================================

// async function generateResumePdf({
//     resume,
//     relevantResumeContext,
//     selfDescription,
//     jobDescription,
// }) {

//     try {

//         // Prefer the job-relevant chunks pulled via RAG.
//         // Fall back to the full raw resume if RAG context
//         // wasn't available (e.g. no jobDescription at call time).
//         const resumeForPrompt =
//             (relevantResumeContext && relevantResumeContext.trim())
//                 ? relevantResumeContext
//                 : (resume || "");

//         const prompt = `
// You are a professional ATS resume writer.

// Create an ATS-friendly resume for a fresher.

// Use ONLY information provided below.

// DO NOT invent:
// - companies
// - job experience
// - education
// - skills
// - projects
// - certifications
// - contact information

// Return ONLY valid JSON.

// Do not return markdown.
// Do not return code fences.
// Do not add explanations.

// Return exactly:

// {
//   "html": ""
// }

// The html field must contain a complete HTML document.

// Requirements:

// - Valid HTML5
// - Include <!DOCTYPE html>
// - Include <html>
// - Include <head>
// - Include <body>
// - CSS must be inside <style>
// - No external CSS
// - No external images
// - No JavaScript
// - No tables for layout
// - ATS friendly
// - Simple professional typography
// - Black/dark text
// - Good spacing
// - One-page resume if possible
// - Include only sections for which information exists
// - Tailor wording toward the target job
// - Do not create fake information

// Possible sections:

// Summary
// Skills
// Projects
// Experience
// Education
// Certifications

// ========================
// RESUME (JOB-RELEVANT CONTEXT)
// ========================

// ${resumeForPrompt || "No resume provided."}

// ========================
// SELF DESCRIPTION
// ========================

// ${selfDescription || "No self description provided."}

// ========================
// TARGET JOB
// ========================

// ${jobDescription || "No job description provided."}
// `;

//         const messages = [

//             {
//                 role: "system",

//                 content:
//                     "You are an ATS resume writer. Return ONLY valid JSON with an html field.",
//             },

//             {
//                 role: "user",

//                 content: prompt,
//             },

//         ];

//         const text =
//             await callGroqWithRetry(

//                 messages,

//                 {
//                     model:
//                         "openai/gpt-oss-120b",

//                     temperature: 0.2,

//                     max_tokens: 6000,
//                 }
//             );

//         console.log(
//             "AI PDF RESPONSE:",
//             text.slice(0, 200)
//         );

//         const cleanJson =
//             extractJson(text);

//         let jsonContent;

//         try {

//             jsonContent =
//                 JSON.parse(cleanJson);

//         } catch (error) {

//             console.error(
//                 "PDF JSON PARSE ERROR:",
//                 error.message
//             );

//             throw new Error(
//                 "AI returned invalid JSON for PDF"
//             );
//         }

//         if (
//             !jsonContent.html ||
//             typeof jsonContent.html !== "string"
//         ) {

//             throw new Error(
//                 "AI response missing valid html field"
//             );
//         }

//         let htmlContent =
//             jsonContent.html.trim();

//         // If AI returns only body content,
//         // wrap it in a complete HTML document.

//         if (
//             !htmlContent
//                 .toLowerCase()
//                 .includes("<!doctype")
//         ) {

//             htmlContent = `
// <!DOCTYPE html>

// <html>

// <head>

// <meta charset="UTF-8">

// <style>

// body {
//     font-family: Arial, Helvetica, sans-serif;
//     color: #111827;
//     margin: 0;
//     padding: 0;
// }

// * {
//     box-sizing: border-box;
// }

// </style>

// </head>

// <body>

// ${htmlContent}

// </body>

// </html>
// `;
//         }

//         const pdfBuffer =
//             await generatePdfFromHtml(
//                 htmlContent
//             );

//         return pdfBuffer;

//     } catch (error) {

//         console.error(
//             "GENERATE RESUME PDF ERROR:",
//             error.message
//         );

//         throw error;
//     }
// }


// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {

//     generateInterviewReport,
//     generateResumePdf,

// };



const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");

// ======================================================
// GROQ INITIALIZATION
// ======================================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


// ======================================================
// ZOD SCHEMA
// ======================================================

const interviewReportSchema = z.object({

    matchScore: z.coerce
        .number()
        .min(0)
        .max(100),

    atsBreakdown: z.object({

        skillsMatch: z.coerce
            .number()
            .min(0)
            .max(100),

        experienceMatch: z.coerce
            .number()
            .min(0)
            .max(100),

        keywordMatch: z.coerce
            .number()
            .min(0)
            .max(100),

        educationMatch: z.coerce
            .number()
            .min(0)
            .max(100),
    }),

    // EXACTLY 5
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ).length(5),

    // EXACTLY 4
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ).length(4),

    skillGaps: z.array(
        z.object({
            skill: z.string(),

            severity: z.enum([
                "low",
                "medium",
                "high",
            ]),
        })
    ).default([]),

    // EXACTLY 7 DAYS
    preparationPlan: z.array(
        z.object({
            day: z.coerce.number(),

            focus: z.string(),

            tasks: z.array(
                z.string()
            ).default([]),
        })
    ).length(7),

    title: z.string(),
});


// ======================================================
// OPTIONAL JSON EXTRACTION FALLBACK
// ======================================================

function extractJson(text) {

    if (!text) {
        throw new Error(
            "Empty AI response"
        );
    }

    const stripped = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start =
        stripped.indexOf("{");

    const end =
        stripped.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1 ||
        end <= start
    ) {
        throw new Error(
            "No valid JSON object found in AI response"
        );
    }

    return stripped.slice(
        start,
        end + 1
    );
}


// ======================================================
// GROQ WITH RETRY
// ======================================================

async function callGroqWithRetry(
    messages,
    options = {},
    maxRetries = 2
) {

    const {
        model = "openai/gpt-oss-120b",
        temperature = 0.2,
        max_tokens = 4000,
        jsonMode = false,
    } = options;

    let lastError;

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {

        try {

            const requestBody = {

                model,

                messages,

                temperature,

                max_tokens,
            };


            // ==================================================
            // FORCE JSON RESPONSE
            // ==================================================

            if (jsonMode) {

                requestBody.response_format = {
                    type: "json_object",
                };

            }


            const response =
                await groq.chat.completions.create(
                    requestBody
                );


            const text =
                response
                    ?.choices?.[0]
                    ?.message
                    ?.content;


            if (
                !text ||
                !text.trim()
            ) {

                throw new Error(
                    "Empty response from Groq"
                );

            }


            return text;


        } catch (error) {

            console.error(
                `Groq attempt ${attempt} failed:`,
                error.message
            );


            lastError = error;


            if (
                attempt <
                maxRetries
            ) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1500
                        )
                );

            }

        }

    }


    throw lastError;
}


// ======================================================
// GENERATE INTERVIEW REPORT
// ======================================================

async function generateInterviewReport({

    resume,

    selfDescription,

    jobDescription,

}) {

    try {

        // ==================================================
        // PROMPT
        // ==================================================

        const prompt = `

You are an ATS resume analyzer helping a fresher.

Analyze the candidate profile against the target job description.

Return ONLY one valid JSON object.

Do not return markdown.

Do not return code fences.

Do not return explanations outside the JSON.

IMPORTANT JSON RULES:

- All JSON must be valid JSON.
- Escape double quotes inside string values.
- Do not use trailing commas.
- Do not include comments.
- Do not include markdown.
- Do not include text before or after the JSON object.

RULES:

1. matchScore must be between 0 and 100.

2. atsBreakdown must contain:

   skillsMatch
   experienceMatch
   keywordMatch
   educationMatch

3. Do not invent experience, skills,
   education or projects.

4. Projects can count as relevant experience
   for a fresher.

5. skillGaps should contain skills clearly
   required by the job but missing or weak
   in the candidate profile.

6. Generate EXACTLY 5 technical questions.

7. Generate EXACTLY 4 behavioral questions.

8. Generate EXACTLY 7 preparation plan days.

9. title must represent the target job role.

10. Each technical question must contain:

    question
    intention
    answer

11. Each behavioral question must contain:

    question
    intention
    answer

12. Each preparation day must contain:

    day
    focus
    tasks

13. tasks must always be an array of strings.

14. severity must be one of:

    low
    medium
    high


JSON structure:

{
  "matchScore": 0,

  "atsBreakdown": {
    "skillsMatch": 0,
    "experienceMatch": 0,
    "keywordMatch": 0,
    "educationMatch": 0
  },

  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": [
        ""
      ]
    }
  ],

  "title": ""
}


========================
CANDIDATE RESUME
========================

${resume || "No resume provided."}


========================
SELF DESCRIPTION
========================

${selfDescription || "No self description provided."}


========================
TARGET JOB DESCRIPTION
========================

${jobDescription || "No job description provided."}

`;


        // ==================================================
        // GROQ MESSAGES
        // ==================================================

        const messages = [

            {
                role: "system",

                content: `
You are an ATS resume analyzer.

Return exactly one valid JSON object.

Never return markdown.

Never return code fences.

Never return explanations outside JSON.

All JSON strings must use valid JSON escaping.

Never place unescaped double quotes inside
JSON string values.
`,
            },

            {
                role: "user",

                content: prompt,
            },

        ];


        // ==================================================
        // CALL GROQ
        // ==================================================

        const text =
            await callGroqWithRetry(

                messages,

                {
                    model:
                        "openai/gpt-oss-120b",

                    temperature:
                        0.2,

                    max_tokens:
                        4000,

                    // IMPORTANT
                    jsonMode:
                        true,
                }

            );


        // ==================================================
        // LOG RESPONSE
        // ==================================================

        console.log(
            "AI INTERVIEW RESPONSE LENGTH:",
            text.length
        );


        // ==================================================
        // PARSE JSON
        // ==================================================

        let data;


        try {

            data =
                JSON.parse(text);


        } catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                error.message
            );


            console.error(
                "AI RESPONSE PREVIEW:",
                text.slice(
                    0,
                    2000
                )
            );


            // Fallback in case the provider
            // still returned markdown/fences.

            try {

                const fallbackJson =
                    extractJson(text);

                data =
                    JSON.parse(
                        fallbackJson
                    );

            } catch (fallbackError) {

                console.error(
                    "JSON FALLBACK PARSE ERROR:",
                    fallbackError.message
                );


                throw new Error(
                    "AI returned malformed JSON"
                );

            }

        }


        // ==================================================
        // NORMALIZE PREPARATION TASKS
        // ==================================================

        if (
            Array.isArray(
                data.preparationPlan
            )
        ) {

            data.preparationPlan =
                data.preparationPlan.map(
                    day => ({

                        ...day,

                        tasks:
                            Array.isArray(
                                day.tasks
                            )

                                ? day.tasks.map(
                                    task =>

                                        typeof task ===
                                        "string"

                                            ? task

                                            : JSON.stringify(
                                                task
                                            )
                                )

                                : [],

                    })
                );

        }


        // ==================================================
        // VALIDATE WITH ZOD
        // ==================================================

        let validated;


        try {

            validated =
                interviewReportSchema.parse(
                    data
                );


        } catch (error) {

            console.error(
                "INTERVIEW REPORT VALIDATION ERROR:",
                error
            );


            throw new Error(
                "AI returned an invalid interview report structure"
            );

        }


        // ==================================================
        // SAFETY CLAMP SCORE
        // ==================================================

        validated.matchScore =
            Math.min(

                100,

                Math.max(

                    0,

                    validated.matchScore

                )

            );


        // ==================================================
        // RETURN REPORT
        // ==================================================

        console.log(
            "Interview report generated successfully."
        );


        return validated;


    } catch (error) {

        console.error(
            "AI SERVICE ERROR:",
            error.message
        );


        throw error;

    }

}


// ======================================================
// GENERATE PDF FROM HTML
// ======================================================

async function generatePdfFromHtml(
    htmlContent
) {

    let browser;


    try {

        // ==================================================
        // LAUNCH PUPPETEER
        // ==================================================

        browser =
            await puppeteer.launch({

                headless: true,

                args: [

                    "--no-sandbox",

                    "--disable-setuid-sandbox",

                    "--disable-dev-shm-usage",

                    "--disable-gpu",

                ],

            });


        // ==================================================
        // NEW PAGE
        // ==================================================

        const page =
            await browser.newPage();


        // ==================================================
        // VIEWPORT
        // ==================================================

        await page.setViewport({

            width: 1200,

            height: 1600,

            deviceScaleFactor: 1,

        });


        // ==================================================
        // LOAD HTML
        // ==================================================

        await page.setContent(

            htmlContent,

            {

                waitUntil:
                    "domcontentloaded",

                timeout:
                    30000,

            }

        );


        // ==================================================
        // PRINT MODE
        // ==================================================

        await page.emulateMediaType(
            "print"
        );


        // ==================================================
        // WAIT FOR FONTS
        // ==================================================

        await page.evaluate(

            async () => {

                if (document.fonts) {

                    await document
                        .fonts
                        .ready;

                }

            }

        );


        // ==================================================
        // GENERATE PDF
        // ==================================================

        const pdfBuffer =
            await page.pdf({

                format:
                    "A4",

                printBackground:
                    true,

                preferCSSPageSize:
                    true,

                margin: {

                    top:
                        "12mm",

                    bottom:
                        "12mm",

                    left:
                        "12mm",

                    right:
                        "12mm",

                },

                timeout:
                    60000,

            });


        // ==================================================
        // VALIDATE PDF
        // ==================================================

        if (
            !pdfBuffer ||
            pdfBuffer.length === 0
        ) {

            throw new Error(
                "Puppeteer returned an empty PDF."
            );

        }


        console.log(
            "Puppeteer PDF size:",
            pdfBuffer.length
        );


        return pdfBuffer;


    } catch (error) {

        console.error(
            "PUPPETEER PDF ERROR:",
            error.message
        );


        throw new Error(
            `PDF generation failed: ${error.message}`
        );


    } finally {

        // ==================================================
        // CLOSE BROWSER
        // ==================================================

        if (browser) {

            try {

                await browser.close();

            } catch (error) {

                console.error(
                    "Browser close error:",
                    error.message
                );

            }

        }

    }

}


// ======================================================
// GENERATE RESUME PDF
// ======================================================

async function generateResumePdf({

    resume,

    relevantResumeContext,

    selfDescription,

    jobDescription,

}) {

    try {

        // ==================================================
        // RESUME CONTEXT
        // ==================================================

        const resumeForPrompt =

            (
                relevantResumeContext &&
                relevantResumeContext.trim()
            )

                ? relevantResumeContext

                : (
                    resume || ""
                );


        // ==================================================
        // PROMPT
        // ==================================================

        const prompt = `

You are a professional ATS resume writer.

Create an ATS-friendly resume for a fresher.

Use ONLY information provided below.

DO NOT invent:

- companies
- job experience
- education
- skills
- projects
- certifications
- contact information

Return ONLY one valid JSON object.

Do not return markdown.

Do not return code fences.

Do not return explanations outside JSON.

IMPORTANT JSON RULES:

- All JSON must be valid.
- Escape double quotes inside HTML strings.
- Do not use trailing commas.
- Do not include comments.

Return exactly:

{
  "html": ""
}

The html field must contain a complete HTML document.

Requirements:

- Valid HTML5
- Include <!DOCTYPE html>
- Include <html>
- Include <head>
- Include <body>
- CSS must be inside <style>
- No external CSS
- No external images
- No JavaScript
- No tables for layout
- ATS friendly
- Simple professional typography
- Black/dark text
- Good spacing
- One-page resume if possible
- Include only sections for which information exists
- Tailor wording toward the target job
- Do not create fake information

Possible sections:

Summary
Skills
Projects
Experience
Education
Certifications


========================
RESUME
JOB-RELEVANT CONTEXT
========================

${resumeForPrompt || "No resume provided."}


========================
SELF DESCRIPTION
========================

${selfDescription || "No self description provided."}


========================
TARGET JOB
========================

${jobDescription || "No job description provided."}

`;


        // ==================================================
        // GROQ MESSAGES
        // ==================================================

        const messages = [

            {
                role: "system",

                content: `
You are an ATS resume writer.

Return exactly one valid JSON object
containing an html field.

Never return markdown.

Never return code fences.

Never return explanations outside JSON.

The html value must be a valid HTML document.

Escape JSON special characters correctly.
`,
            },

            {
                role: "user",

                content: prompt,
            },

        ];


        // ==================================================
        // CALL GROQ
        // ==================================================

        const text =
            await callGroqWithRetry(

                messages,

                {

                    model:
                        "openai/gpt-oss-120b",

                    temperature:
                        0.2,

                    max_tokens:
                        6000,

                    // IMPORTANT
                    jsonMode:
                        true,

                }

            );


        // ==================================================
        // LOG RESPONSE
        // ==================================================

        console.log(
            "AI PDF RESPONSE LENGTH:",
            text.length
        );


        console.log(
            "AI PDF RESPONSE PREVIEW:",
            text.slice(
                0,
                300
            )
        );


        // ==================================================
        // PARSE JSON
        // ==================================================

        let jsonContent;


        try {

            jsonContent =
                JSON.parse(text);


        } catch (error) {

            console.error(
                "PDF JSON PARSE ERROR:",
                error.message
            );


            // Fallback

            try {

                const fallbackJson =
                    extractJson(text);

                jsonContent =
                    JSON.parse(
                        fallbackJson
                    );

            } catch (
                fallbackError
            ) {

                console.error(
                    "PDF FALLBACK JSON ERROR:",
                    fallbackError.message
                );


                throw new Error(
                    "AI returned invalid JSON for PDF"
                );

            }

        }


        // ==================================================
        // VALIDATE HTML
        // ==================================================

        if (

            !jsonContent.html ||

            typeof jsonContent.html !==
                "string"

        ) {

            throw new Error(
                "AI response missing valid html field"
            );

        }


        let htmlContent =
            jsonContent.html.trim();


        // ==================================================
        // COMPLETE HTML DOCUMENT
        // ==================================================

        if (

            !htmlContent
                .toLowerCase()
                .includes("<!doctype")

        ) {

            htmlContent = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color:
        #111827;

    margin:
        0;

    padding:
        0;

}

* {

    box-sizing:
        border-box;

}

</style>

</head>

<body>

${htmlContent}

</body>

</html>

`;

        }


        // ==================================================
        // GENERATE PDF
        // ==================================================

        const pdfBuffer =
            await generatePdfFromHtml(
                htmlContent
            );


        return pdfBuffer;


    } catch (error) {

        console.error(
            "GENERATE RESUME PDF ERROR:",
            error.message
        );


        throw error;

    }

}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    generateInterviewReport,

    generateResumePdf,

};