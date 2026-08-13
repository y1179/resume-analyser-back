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

// // Initialize Groq
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
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

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   try {
//     const prompt = `
// You are an expert technical interviewer.

// Return ONLY valid JSON. No explanation.

// IMPORTANT:
// - preparationPlan.tasks must be an array of STRINGS ONLY
// - DO NOT return objects inside tasks
// - Example:
//   "tasks": ["Learn React", "Practice coding"]

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
//       model: "llama-3.1-8b-instant",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const text = response.choices[0].message.content;

//     // ✅ Check valid JSON format
//     if (!text || !text.trim().startsWith("{")) {
//       console.error("❌ Invalid AI Response:", text);
//       throw new Error("AI did not return valid JSON");
//     }

//     // ✅ Parse JSON
//     let data = JSON.parse(text);

//     // 🔥 FIX: Normalize tasks (VERY IMPORTANT)
//     if (data.preparationPlan) {
//       data.preparationPlan = data.preparationPlan.map((day) => ({
//         ...day,
//         tasks: (day.tasks || []).map((task) => {
//           if (typeof task === "string") return task;
//           if (typeof task === "object") {
//             return task.task || JSON.stringify(task);
//           }
//           return String(task);
//         }),
//       }));
//     }

//     // ✅ Validate with Zod
//     const validated = interviewReportSchema.parse(data);

//     return validated;
//   } catch (error) {
//     console.error("AI SERVICE ERROR:", error);

//     throw new Error("Failed to generate interview report");
//   }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4", margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     })

//     await browser.close()

//     return pdfBuffer
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const resumePdfSchema = z.object({
//         html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
//     })

//     const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `

   
//      const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     })


//     const jsonContent = JSON.parse(response.text)

//     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

//     return pdfBuffer

// }

// module.exports = { generateInterviewReport , generateResumePdf };



// const Groq = require("groq-sdk");
// const { z } = require("zod");
// const puppeteer = require("puppeteer"); // ✅ Added missing import

// // Initialize Groq
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Schema for Interview Report
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
// - matchScore should be between 0–100
// - Return JSON in this exact structure:
// {
//   "matchScore": number,
//   "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
//   "preparationPlan": [{ "day": number, "focus": "", "tasks": ["string"] }],
//   "title": ""
// }

// Candidate Resume: ${resume}
// Self Description: ${selfDescription}
// Job Description: ${jobDescription}
// `;

//     const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     const text = response.choices[0].message.content;

//     // ✅ Clean potential markdown backticks from AI response
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     const cleanJson = jsonMatch ? jsonMatch[0] : text;

//     let data = JSON.parse(cleanJson);

//     // Normalize tasks
//     if (data.preparationPlan) {
//       data.preparationPlan = data.preparationPlan.map((day) => ({
//         ...day,
//         tasks: (day.tasks || []).map(task => typeof task === 'string' ? task : JSON.stringify(task))
//       }));
//     }

//     return interviewReportSchema.parse(data);
//   } catch (error) {
//     console.error("AI SERVICE ERROR (Report):", error);
//     throw new Error("Failed to generate interview report");
//   }
// }

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//         format: "A4", 
//         margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
//     });

//     await browser.close();
//     return pdfBuffer;
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//     try {
//         const prompt = `Generate a professional resume in HTML format.
//             Return ONLY a JSON object: {"html": "your_html_string_here"}
            
//             Resume Data: ${resume}
//             Self Description: ${selfDescription}
//             Target Job: ${jobDescription}

//             Requirements:
//             - Professional CSS styling included in <style> tags.
//             - ATS friendly.
//             - 1-2 pages maximum.
//         `;

//         const response = await groq.chat.completions.create({
//             model: "llama-3.1-8b-instant",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.5,
//         });

//         // ✅ FIX: Use choices[0].message.content instead of .text
//         const text = response.choices[0].message.content;

//         // ✅ Extract JSON from potential Markdown wrappers
//         const jsonMatch = text.match(/\{[\s\S]*\}/);
//         const cleanJson = jsonMatch ? jsonMatch[0] : text;
        
//         const jsonContent = JSON.parse(cleanJson);

//         if (!jsonContent.html) throw new Error("AI response missing 'html' field");

//         return await generatePdfFromHtml(jsonContent.html);

//     } catch (error) {
//         console.error("AI SERVICE ERROR (PDF):", error);
//         throw error;
//     }
// }

// module.exports = { generateInterviewReport, generateResumePdf };


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
// // ZOD SCHEMA - INTERVIEW REPORT
// // ======================================================

// const interviewReportSchema = z.object({

//     // Overall ATS score
//     matchScore: z
//         .number()
//         .min(0)
//         .max(100),

//     // Explainable ATS score
//     atsBreakdown: z.object({
//         skillsMatch: z
//             .number()
//             .min(0)
//             .max(100),

//         experienceMatch: z
//             .number()
//             .min(0)
//             .max(100),

//         keywordMatch: z
//             .number()
//             .min(0)
//             .max(100),

//         educationMatch: z
//             .number()
//             .min(0)
//             .max(100),
//     }),

//     // Technical questions
//     technicalQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string(),
//         })
//     ),

//     // Behavioral questions
//     behavioralQuestions: z.array(
//         z.object({
//             question: z.string(),
//             intention: z.string(),
//             answer: z.string(),
//         })
//     ),

//     // Skill gaps
//     skillGaps: z.array(
//         z.object({
//             skill: z.string(),
//             severity: z.enum(["low", "medium", "high"]),
//         })
//     ),

//     // Preparation roadmap
//     preparationPlan: z.array(
//         z.object({
//             day: z.number(),
//             focus: z.string(),
//             tasks: z.array(z.string()),
//         })
//     ),

//     // Job title
//     title: z.string(),
// });


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
// You are an expert ATS resume analyzer and technical interviewer.

// Your task is to analyze a candidate's resume against a target job description.

// Return ONLY valid JSON.
// Do NOT return markdown.
// Do NOT use code fences.
// Do NOT add explanations outside the JSON.

// IMPORTANT:

// 1. matchScore must be an integer between 0 and 100.

// 2. atsBreakdown must contain:
//    - skillsMatch
//    - experienceMatch
//    - keywordMatch
//    - educationMatch

// 3. Each ATS sub-score must be between 0 and 100.

// 4. The overall matchScore should be a reasonable combined assessment of the four ATS scores.

// 5. Do not give an artificially high score.
//    If important job requirements are missing from the resume, reduce the score.

// 6. skillGaps should contain skills that are required or preferred by the job description but are missing or weak in the candidate profile.

// 7. Technical questions should be based on the actual technologies and requirements in the job description and resume.

// 8. Behavioral questions should be relevant to the candidate's background and the target role.

// 9. preparationPlan should create a practical preparation roadmap based on the candidate's weaknesses and the job requirements.

// 10. title should represent the target job role.

// Return exactly this structure:

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


// ========================
// ATS SCORING GUIDELINES
// ========================

// Skills Match:
// Compare technical and professional skills required by the job with skills demonstrated in the resume.

// Experience Match:
// Compare the experience level and type of experience required by the job with the candidate's actual experience.

// Keyword Match:
// Compare important keywords, technologies, tools, frameworks, methodologies and terminology from the job description with the resume.

// Education Match:
// Compare the education/degree requirements of the job with the candidate's education.

// Skill gaps must be consistent with the ATS analysis.

// Do not invent experience, education, projects or skills that are not present in the candidate information.
// `;

//         // ==================================================
//         // GROQ REQUEST
//         // ==================================================

//         const response = await groq.chat.completions.create({
//             model: "llama-3.1-8b-instant",

//             messages: [
//                 {
//                     role: "system",
//                     content:
//                         "You are an ATS analyzer and technical interviewer. Always return valid JSON only.",
//                 },
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],

//             temperature: 0.3,
//         });


//         // ==================================================
//         // GET AI RESPONSE
//         // ==================================================

//         const text = response?.choices?.[0]?.message?.content;

//         if (!text) {
//             throw new Error("Empty response received from Groq");
//         }

//         console.log("AI REPORT RESPONSE:");
//         console.log(text);


//         // ==================================================
//         // CLEAN JSON
//         // ==================================================

//         const jsonMatch = text.match(/\{[\s\S]*\}/);

//         if (!jsonMatch) {
//             throw new Error("AI did not return valid JSON");
//         }

//         const cleanJson = jsonMatch[0];

//         let data;

//         try {
//             data = JSON.parse(cleanJson);
//         } catch (error) {
//             console.error("JSON PARSE ERROR:", error);
//             console.error("RAW AI RESPONSE:", text);

//             throw new Error("AI returned invalid JSON");
//         }


//         // ==================================================
//         // NORMALIZE DATA
//         // ==================================================

//         if (data.preparationPlan) {

//             data.preparationPlan = data.preparationPlan.map((day) => ({
//                 ...day,

//                 tasks: (day.tasks || []).map((task) =>
//                     typeof task === "string"
//                         ? task
//                         : JSON.stringify(task)
//                 ),
//             }));

//         }


//         // ==================================================
//         // NORMALIZE ATS SCORES
//         // ==================================================

//         if (data.atsBreakdown) {

//             data.atsBreakdown = {
//                 skillsMatch: Number(data.atsBreakdown.skillsMatch),
//                 experienceMatch: Number(data.atsBreakdown.experienceMatch),
//                 keywordMatch: Number(data.atsBreakdown.keywordMatch),
//                 educationMatch: Number(data.atsBreakdown.educationMatch),
//             };

//         }


//         // ==================================================
//         // NORMALIZE OVERALL SCORE
//         // ==================================================

//         data.matchScore = Number(data.matchScore);


//         // ==================================================
//         // VALIDATE USING ZOD
//         // ==================================================

//         const validatedData = interviewReportSchema.parse(data);

//         return validatedData;

//     } catch (error) {

//         console.error(
//             "AI SERVICE ERROR (REPORT):",
//             error
//         );

//         throw new Error(
//             error.message || "Failed to generate interview report"
//         );
//     }
// }


// // ======================================================
// // GENERATE PDF FROM HTML
// // ======================================================

// async function generatePdfFromHtml(htmlContent) {

//     let browser;

//     try {

//         browser = await puppeteer.launch({
//             headless: "new",

//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox",
//                 "--disable-dev-shm-usage",
//             ],
//         });

//         const page = await browser.newPage();

//         await page.setContent(htmlContent, {
//             waitUntil: "networkidle0",
//         });

//         const pdfBuffer = await page.pdf({
//             format: "A4",

//             printBackground: true,

//             margin: {
//                 top: "20mm",
//                 bottom: "20mm",
//                 left: "15mm",
//                 right: "15mm",
//             },
//         });

//         return pdfBuffer;

//     } catch (error) {

//         console.error(
//             "PDF GENERATION ERROR:",
//             error
//         );

//         throw new Error(
//             "Failed to generate PDF"
//         );

//     } finally {

//         if (browser) {
//             await browser.close();
//         }

//     }
// }


// // ======================================================
// // GENERATE RESUME PDF
// // ======================================================

// async function generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {

//     try {

//         const prompt = `
// You are a professional resume writer.

// Generate a professional ATS-friendly resume based ONLY on the information provided below.

// Return ONLY valid JSON.
// Do not return markdown.
// Do not use code fences.

// The JSON must have exactly this structure:

// {
//   "html": ""
// }

// The HTML should contain:

// - A professional resume layout
// - Name/contact information if available
// - Professional summary
// - Skills
// - Education
// - Projects
// - Experience if available
// - Clean typography
// - ATS-friendly structure
// - CSS inside a <style> tag
// - Maximum 1-2 pages
// - No external CSS
// - No external images
// - No JavaScript

// Do not invent information.

// ========================
// RESUME DATA
// ========================

// ${resume || "No resume provided."}


// ========================
// SELF DESCRIPTION
// ========================

// ${selfDescription || "No self description provided."}


// ========================
// TARGET JOB
// ========================

// ${jobDescription || "No target job provided."}
// `;


//         // ==================================================
//         // GROQ REQUEST
//         // ==================================================

//         const response = await groq.chat.completions.create({

//             model: "llama-3.1-8b-instant",

//             messages: [
//                 {
//                     role: "system",
//                     content:
//                         "You are an expert ATS resume writer. Return valid JSON only.",
//                 },
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],

//             temperature: 0.3,
//         });


//         // ==================================================
//         // GET RESPONSE
//         // ==================================================

//         const text =
//             response?.choices?.[0]?.message?.content;

//         if (!text) {
//             throw new Error(
//                 "Empty response received from Groq"
//             );
//         }

//         console.log("AI PDF RESPONSE:");
//         console.log(text);


//         // ==================================================
//         // EXTRACT JSON
//         // ==================================================

//         const jsonMatch =
//             text.match(/\{[\s\S]*\}/);

//         if (!jsonMatch) {
//             throw new Error(
//                 "AI did not return valid JSON for PDF"
//             );
//         }

//         const cleanJson =
//             jsonMatch[0];


//         let jsonContent;

//         try {

//             jsonContent =
//                 JSON.parse(cleanJson);

//         } catch (error) {

//             console.error(
//                 "PDF JSON PARSE ERROR:",
//                 error
//             );

//             throw new Error(
//                 "AI returned invalid PDF JSON"
//             );
//         }


//         // ==================================================
//         // VALIDATE HTML
//         // ==================================================

//         if (
//             !jsonContent.html ||
//             typeof jsonContent.html !== "string"
//         ) {
//             throw new Error(
//                 "AI response missing valid 'html' field"
//             );
//         }


//         // ==================================================
//         // GENERATE PDF
//         // ==================================================

//         const pdfBuffer =
//             await generatePdfFromHtml(
//                 jsonContent.html
//             );

//         return pdfBuffer;

//     } catch (error) {

//         console.error(
//             "AI SERVICE ERROR (PDF):",
//             error
//         );

//         throw error;
//     }
// }


// // ======================================================
// // EXPORT
// // ======================================================

// module.exports = {
//     generateInterviewReport,
//     generateResumePdf,
// };



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
// // ZOD SCHEMA — coerce strings to numbers (fixes "72" vs 72)
// // ======================================================

// const interviewReportSchema = z.object({

//     matchScore: z.coerce.number().min(0).max(100),

//     atsBreakdown: z.object({
//         skillsMatch:      z.coerce.number().min(0).max(100),
//         experienceMatch:  z.coerce.number().min(0).max(100),
//         keywordMatch:     z.coerce.number().min(0).max(100),
//         educationMatch:   z.coerce.number().min(0).max(100),
//     }),

//     technicalQuestions: z.array(
//         z.object({
//             question:  z.string(),
//             intention: z.string(),
//             answer:    z.string(),
//         })
//     ).default([]),

//     behavioralQuestions: z.array(
//         z.object({
//             question:  z.string(),
//             intention: z.string(),
//             answer:    z.string(),
//         })
//     ).default([]),

//     skillGaps: z.array(
//         z.object({
//             skill:    z.string(),
//             severity: z.enum(["low", "medium", "high"]),
//         })
//     ).default([]),

//     preparationPlan: z.array(
//         z.object({
//             day:   z.coerce.number(),
//             focus: z.string(),
//             tasks: z.array(z.string()).default([]),
//         })
//     ).default([]),

//     title: z.string(),
// });


// // ======================================================
// // HELPER — safely parse JSON from AI response
// // Handles: markdown fences, extra text before/after JSON
// // ======================================================

// function extractJson(text) {
//     if (!text) throw new Error("Empty AI response");

//     // Remove markdown code fences if present
//     const stripped = text
//         .replace(/```json/gi, "")
//         .replace(/```/g, "")
//         .trim();

//     // Find the outermost { ... }
//     const start = stripped.indexOf("{");
//     const end   = stripped.lastIndexOf("}");

//     if (start === -1 || end === -1 || end <= start) {
//         throw new Error("No valid JSON object found in AI response");
//     }

//     return stripped.slice(start, end + 1);
// }


// // ======================================================
// // HELPER — call Groq with retry on failure
// // ======================================================

// async function callGroqWithRetry(messages, options = {}, maxRetries = 2) {
//     const {
//         model       = "llama-3.3-70b-versatile",
//         temperature = 0.2,
//         max_tokens  = 4000,
//     } = options;

//     let lastError;

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             const response = await groq.chat.completions.create({
//                 model,
//                 messages,
//                 temperature,
//                 max_tokens,
//             });

//             const text = response?.choices?.[0]?.message?.content;

//             if (!text || !text.trim()) {
//                 throw new Error("Empty response from Groq");
//             }

//             return text;

//         } catch (err) {
//             console.error(`Groq attempt ${attempt} failed:`, err.message);
//             lastError = err;

//             if (attempt < maxRetries) {
//                 // Wait 1.5 seconds before retrying
//                 await new Promise(resolve => setTimeout(resolve, 1500));
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

//         // ── Build a shorter, cleaner prompt for freshers ──
//         // Fresher-friendly: focuses on projects, education,
//         // skills rather than years of experience
//         const prompt = `
// You are an ATS resume analyzer helping a fresher (0-1 year experience).

// Analyze the candidate profile against the job description.
// Be fair and realistic — freshers are evaluated on projects, skills, and education, NOT work experience.

// RULES:
// - Return ONLY valid JSON — no markdown, no code fences, no explanation
// - matchScore: integer 0-100 based on how well fresher matches the role
// - Do NOT penalize heavily for lack of experience if projects are relevant
// - skillGaps: only list skills clearly mentioned in JD but missing from resume
// - technicalQuestions: 5 questions based on candidate's actual skills and JD
// - behavioralQuestions: 4 questions suitable for a fresher
// - preparationPlan: 7-day realistic plan for a fresher
// - title: the job role name from the JD

// Return exactly this JSON structure:
// {
//   "matchScore": 0,
//   "atsBreakdown": {
//     "skillsMatch": 0,
//     "experienceMatch": 0,
//     "keywordMatch": 0,
//     "educationMatch": 0
//   },
//   "technicalQuestions": [
//     { "question": "", "intention": "", "answer": "" }
//   ],
//   "behavioralQuestions": [
//     { "question": "", "intention": "", "answer": "" }
//   ],
//   "skillGaps": [
//     { "skill": "", "severity": "low" }
//   ],
//   "preparationPlan": [
//     { "day": 1, "focus": "", "tasks": [""] }
//   ],
//   "title": ""
// }

// === CANDIDATE RESUME ===
// ${resume || "No resume provided."}

// === SELF DESCRIPTION ===
// ${selfDescription || "No self description provided."}

// === TARGET JOB DESCRIPTION ===
// ${jobDescription}

// === SCORING GUIDE FOR FRESHER ===
// skillsMatch: Match technical skills in resume vs JD (projects count)
// experienceMatch: For freshers score 40-60 baseline; boost if projects are relevant
// keywordMatch: How many JD keywords appear in resume
// educationMatch: Does degree match JD requirements?
// `;

//         const messages = [
//             {
//                 role: "system",
//                 content: "You are an ATS analyzer. Return ONLY valid JSON. No markdown. No explanation.",
//             },
//             {
//                 role: "user",
//                 content: prompt,
//             },
//         ];

//         // Use 70b model for better JSON reliability
//         const text = await callGroqWithRetry(messages, {
//             model:       "llama-3.3-70b-versatile",
//             temperature: 0.2,
//             max_tokens:  4000,
//         });

//         console.log("AI REPORT RAW RESPONSE:", text.slice(0, 200), "...");

//         // ── Extract and parse JSON ──
//         const cleanJson = extractJson(text);
//         let data;

//         try {
//             data = JSON.parse(cleanJson);
//         } catch (parseErr) {
//             console.error("JSON PARSE ERROR:", parseErr.message);
//             console.error("CLEAN JSON ATTEMPT:", cleanJson.slice(0, 300));
//             throw new Error("AI returned malformed JSON");
//         }

//         // ── Normalize preparationPlan tasks ──
//         if (Array.isArray(data.preparationPlan)) {
//             data.preparationPlan = data.preparationPlan.map(day => ({
//                 ...day,
//                 tasks: (day.tasks || []).map(task =>
//                     typeof task === "string" ? task : JSON.stringify(task)
//                 ),
//             }));
//         }

//         // ── Validate with Zod (coerce handles string numbers) ──
//         const validated = interviewReportSchema.parse(data);

//         // ── Safety clamp all scores to 0-100 ──
//         validated.matchScore = Math.min(100, Math.max(0, validated.matchScore));
//         validated.atsBreakdown.skillsMatch     = Math.min(100, Math.max(0, validated.atsBreakdown.skillsMatch));
//         validated.atsBreakdown.experienceMatch = Math.min(100, Math.max(0, validated.atsBreakdown.experienceMatch));
//         validated.atsBreakdown.keywordMatch    = Math.min(100, Math.max(0, validated.atsBreakdown.keywordMatch));
//         validated.atsBreakdown.educationMatch  = Math.min(100, Math.max(0, validated.atsBreakdown.educationMatch));

//         return validated;

//     } catch (error) {
//         console.error("AI SERVICE ERROR (REPORT):", error.message);
//         throw new Error(error.message || "Failed to generate interview report");
//     }
// }


// // ======================================================
// // GENERATE PDF FROM HTML
// // ======================================================

// async function generatePdfFromHtml(htmlContent) {
//     let browser;

//     try {
//         browser = await puppeteer.launch({
//             headless: true,            // ← fixed: "new" is deprecated
//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox",
//                 "--disable-dev-shm-usage",
//                 "--disable-gpu",
//                 "--single-process",    // ← better for Render/cloud environments
//             ],
//         });

//         const page = await browser.newPage();

//         await page.setContent(htmlContent, {
//             waitUntil: "domcontentloaded", // ← faster than networkidle0, enough for static HTML
//         });

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             printBackground: true,
//             margin: {
//                 top:    "20mm",
//                 bottom: "20mm",
//                 left:   "15mm",
//                 right:  "15mm",
//             },
//         });

//         return pdfBuffer;

//     } catch (error) {
//         console.error("PDF GENERATION ERROR:", error.message);
//         throw new Error("Failed to generate PDF");

//     } finally {
//         if (browser) {
//             try { await browser.close(); } catch (_) {}
//         }
//     }
// }


// // ======================================================
// // GENERATE RESUME PDF
// // ======================================================

// async function generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {
//     try {

//         // ── Use 70b model for HTML generation (8b truncates HTML) ──
//         const prompt = `
// You are a professional resume writer.

// Create an ATS-friendly HTML resume for a fresher based ONLY on the information below.
// Focus on skills, projects, education, and certifications — NOT work experience.

// Return ONLY valid JSON in this exact format:
// { "html": "<html content here>" }

// No markdown. No code fences. No explanation outside the JSON.

// HTML requirements:
// - Complete valid HTML with DOCTYPE
// - All CSS inside a <style> tag — no external CSS
// - Clean professional layout suitable for freshers
// - Sections: Summary, Skills, Projects, Education, Certifications
// - ATS-friendly: simple fonts, no images, no tables for layout
// - Fits 1 page for a fresher profile
// - No JavaScript
// - Do NOT invent information not present in the resume data

// === RESUME DATA ===
// ${resume || "No resume provided."}

// === SELF DESCRIPTION ===
// ${selfDescription || "No self description provided."}

// === TARGET JOB ===
// ${jobDescription || "Not specified."}
// `;

//         const messages = [
//             {
//                 role: "system",
//                 content: "You are an expert resume writer. Return ONLY valid JSON with an html field. No markdown.",
//             },
//             {
//                 role: "user",
//                 content: prompt,
//             },
//         ];

//         // 70b model handles long HTML output much better than 8b
//         const text = await callGroqWithRetry(messages, {
//             model:       "llama-3.3-70b-versatile",
//             temperature: 0.2,
//             max_tokens:  6000, // ← more tokens for complete HTML
//         });

//         console.log("AI PDF RAW RESPONSE:", text.slice(0, 200), "...");

//         // ── Extract JSON ──
//         const cleanJson = extractJson(text);
//         let jsonContent;

//         try {
//             jsonContent = JSON.parse(cleanJson);
//         } catch (parseErr) {
//             console.error("PDF JSON PARSE ERROR:", parseErr.message);
//             throw new Error("AI returned invalid JSON for PDF");
//         }

//         // ── Validate HTML field exists ──
//         if (!jsonContent.html || typeof jsonContent.html !== "string") {
//             throw new Error("AI response missing valid 'html' field");
//         }

//         // ── Ensure complete HTML document ──
//         let htmlContent = jsonContent.html.trim();
//         if (!htmlContent.toLowerCase().startsWith("<!doctype")) {
//             htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`;
//         }

//         // ── Generate PDF ──
//         const pdfBuffer = await generatePdfFromHtml(htmlContent);

//         return pdfBuffer;

//     } catch (error) {
//         console.error("AI SERVICE ERROR (PDF):", error.message);
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
// // ZOD SCHEMA — INTERVIEW REPORT
// // ======================================================

// const interviewReportSchema = z.object({
//     matchScore: z.coerce.number().min(0).max(100),

//     atsBreakdown: z.object({
//         skillsMatch: z.coerce.number().min(0).max(100),
//         experienceMatch: z.coerce.number().min(0).max(100),
//         keywordMatch: z.coerce.number().min(0).max(100),
//         educationMatch: z.coerce.number().min(0).max(100),
//     }),

//     technicalQuestions: z
//         .array(
//             z.object({
//                 question: z.string(),
//                 intention: z.string(),
//                 answer: z.string(),
//             })
//         )
//         .default([]),

//     behavioralQuestions: z
//         .array(
//             z.object({
//                 question: z.string(),
//                 intention: z.string(),
//                 answer: z.string(),
//             })
//         )
//         .default([]),

//     skillGaps: z
//         .array(
//             z.object({
//                 skill: z.string(),
//                 severity: z.enum(["low", "medium", "high"]),
//             })
//         )
//         .default([]),

//     preparationPlan: z
//         .array(
//             z.object({
//                 day: z.coerce.number().min(1),
//                 focus: z.string(),
//                 tasks: z.array(z.string()).default([]),
//             })
//         )
//         .default([]),

//     title: z.string(),
// });

// // ======================================================
// // HELPER — EXTRACT JSON FROM AI RESPONSE
// // ======================================================

// function extractJson(text) {
//     if (!text || typeof text !== "string") {
//         throw new Error("Empty AI response");
//     }

//     let cleaned = text.trim();

//     // Remove markdown fences
//     cleaned = cleaned
//         .replace(/^```json\s*/i, "")
//         .replace(/^```\s*/i, "")
//         .replace(/\s*```$/i, "")
//         .trim();

//     // Find JSON object
//     const firstBrace = cleaned.indexOf("{");
//     const lastBrace = cleaned.lastIndexOf("}");

//     if (
//         firstBrace === -1 ||
//         lastBrace === -1 ||
//         lastBrace <= firstBrace
//     ) {
//         throw new Error("No valid JSON object found in AI response");
//     }

//     return cleaned.slice(firstBrace, lastBrace + 1);
// }

// // ======================================================
// // HELPER — GROQ REQUEST WITH RETRY
// // ======================================================

// async function callGroqWithRetry(
//     messages,
//     options = {},
//     maxRetries = 2
// ) {
//     const {
//         model = "llama-3.3-70b-versatile",
//         temperature = 0.2,
//         max_tokens = 4000,
//     } = options;

//     let lastError;

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//             const response =
//                 await groq.chat.completions.create({
//                     model,
//                     messages,
//                     temperature,
//                     max_tokens,
//                     response_format: {
//                         type: "json_object",
//                     },
//                 });

//             const text =
//                 response?.choices?.[0]?.message?.content;

//             if (!text || !text.trim()) {
//                 throw new Error(
//                     "Empty response received from Groq"
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
//                 await new Promise((resolve) =>
//                     setTimeout(resolve, 1500)
//                 );
//             }
//         }
//     }

//     throw lastError;
// }

// // ======================================================
// // NORMALIZE INTERVIEW REPORT
// // ======================================================

// function normalizeInterviewReport(data) {
//     // Normalize preparation tasks
//     if (Array.isArray(data.preparationPlan)) {
//         data.preparationPlan =
//             data.preparationPlan.map((day) => ({
//                 ...day,

//                 day: Number(day.day),

//                 tasks: Array.isArray(day.tasks)
//                     ? day.tasks.map((task) =>
//                           typeof task === "string"
//                               ? task
//                               : JSON.stringify(task)
//                       )
//                     : [],
//             }));
//     }

//     // Normalize scores
//     if (data.atsBreakdown) {
//         data.atsBreakdown = {
//             skillsMatch: Number(
//                 data.atsBreakdown.skillsMatch
//             ),

//             experienceMatch: Number(
//                 data.atsBreakdown.experienceMatch
//             ),

//             keywordMatch: Number(
//                 data.atsBreakdown.keywordMatch
//             ),

//             educationMatch: Number(
//                 data.atsBreakdown.educationMatch
//             ),
//         };
//     }

//     data.matchScore = Number(data.matchScore);

//     return data;
// }

// // ======================================================
// // GENERATE INTERVIEW REPORT
// // ======================================================

// async function generateInterviewReport({
//     resume = "",
//     selfDescription = "",
//     jobDescription = "",
// }) {
//     try {
//         if (!jobDescription.trim()) {
//             throw new Error(
//                 "Job description is required"
//             );
//         }

//         const prompt = `
// You are an expert ATS resume analyzer and technical interviewer.

// Analyze the candidate against the target job description.

// The candidate may be a fresher or early-career developer.

// IMPORTANT RULES:

// 1. Use ONLY information present in the candidate information and job description.

// 2. NEVER invent:
//    - Work experience
//    - Skills
//    - Projects
//    - Education
//    - Certifications
//    - Companies
//    - Job titles

// 3. Projects, internships, coursework and demonstrated skills can be considered relevant experience for a fresher.

// 4. Do NOT heavily penalize a fresher simply because they do not have professional work experience.

// 5. However, if the JD explicitly requires professional experience, reflect that requirement in experienceMatch.

// 6. skillGaps should contain ONLY skills or requirements that are clearly required/preferred in the JD but are missing or weak in the candidate information.

// 7. Technical questions must be relevant to:
//    - The target job
//    - Technologies in the JD
//    - Technologies actually present in the candidate profile

// 8. Do not ask questions about technologies that are completely unrelated to the candidate or JD.

// 9. Behavioral questions should be appropriate for a fresher/early-career candidate.

// 10. preparationPlan must address the actual skill gaps.

// 11. title must represent the target role from the job description.

// 12. matchScore must be a realistic overall assessment.

// 13. All scores must be between 0 and 100.

// 14. Do not artificially increase the score.

// 15. If the candidate does not satisfy an important JD requirement, reduce the relevant score.

// 16. Return exactly:
//    - 5 technical questions
//    - 4 behavioral questions
//    - A practical 7-day preparation plan

// Return ONLY valid JSON.

// JSON STRUCTURE:

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

// ==============================
// CANDIDATE RESUME / RAG CONTEXT
// ==============================

// ${resume || "No resume information provided."}

// ==============================
// SELF DESCRIPTION
// ==============================

// ${selfDescription || "No self description provided."}

// ==============================
// TARGET JOB DESCRIPTION
// ==============================

// ${jobDescription}

// ==============================
// SCORING GUIDELINES
// ==============================

// skillsMatch:
// Compare required technical/professional skills with demonstrated candidate skills.

// experienceMatch:
// Consider professional experience, internships, projects and relevant practical experience.
// For a fresher, do not automatically give a very low score.

// keywordMatch:
// Compare important technologies, tools, frameworks and terminology from the JD against the candidate information.

// educationMatch:
// Compare the required degree/education with the candidate's education.

// The four sub-scores should be consistent with the overall matchScore.
// `;

//         const messages = [
//             {
//                 role: "system",
//                 content:
//                     "You are an expert ATS analyzer. Return ONLY valid JSON.",
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
//                         "llama-3.3-70b-versatile",
//                     temperature: 0.2,
//                     max_tokens: 5000,
//                 },
//                 2
//             );

//         console.log(
//             "AI REPORT RESPONSE:",
//             text.slice(0, 300)
//         );

//         const cleanJson = extractJson(text);

//         let data;

//         try {
//             data = JSON.parse(cleanJson);
//         } catch (error) {
//             console.error(
//                 "REPORT JSON PARSE ERROR:",
//                 error.message
//             );

//             throw new Error(
//                 "AI returned malformed JSON"
//             );
//         }

//         data =
//             normalizeInterviewReport(data);

//         const validated =
//             interviewReportSchema.parse(data);

//         // Safety clamp
//         validated.matchScore = Math.round(
//             Math.min(
//                 100,
//                 Math.max(
//                     0,
//                     validated.matchScore
//                 )
//             )
//         );

//         validated.atsBreakdown.skillsMatch =
//             Math.round(
//                 Math.min(
//                     100,
//                     Math.max(
//                         0,
//                         validated.atsBreakdown
//                             .skillsMatch
//                     )
//                 )
//             );

//         validated.atsBreakdown.experienceMatch =
//             Math.round(
//                 Math.min(
//                     100,
//                     Math.max(
//                         0,
//                         validated.atsBreakdown
//                             .experienceMatch
//                     )
//                 )
//             );

//         validated.atsBreakdown.keywordMatch =
//             Math.round(
//                 Math.min(
//                     100,
//                     Math.max(
//                         0,
//                         validated.atsBreakdown
//                             .keywordMatch
//                     )
//                 )
//             );

//         validated.atsBreakdown.educationMatch =
//             Math.round(
//                 Math.min(
//                     100,
//                     Math.max(
//                         0,
//                         validated.atsBreakdown
//                             .educationMatch
//                     )
//                 )
//             );

//         return validated;

//     } catch (error) {
//         console.error(
//             "AI SERVICE ERROR (REPORT):",
//             error
//         );

//         throw new Error(
//             error.message ||
//                 "Failed to generate interview report"
//         );
//     }
// }

// // ======================================================
// // GENERATE PDF FROM HTML USING PUPPETEER
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

//         await page.setContent(
//             htmlContent,
//             {
//                 waitUntil:
//                     "domcontentloaded",
//             }
//         );

//         const pdfBuffer =
//             await page.pdf({
//                 format: "A4",

//                 printBackground: true,

//                 preferCSSPageSize: true,

//                 margin: {
//                     top: "15mm",
//                     bottom: "15mm",
//                     left: "12mm",
//                     right: "12mm",
//                 },
//             });

//         return pdfBuffer;

//     } catch (error) {
//         console.error(
//             "PDF GENERATION ERROR:",
//             error
//         );

//         throw new Error(
//             "Failed to generate PDF"
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
// // GENERATE ATS RESUME PDF
// // ======================================================

// // async function generateResumePdf({
// //     resume = "",
// //     selfDescription = "",
// //     jobDescription = "",
// // }) {
// //     try {
// //         if (
// //             !resume.trim() &&
// //             !selfDescription.trim()
// //         ) {
// //             throw new Error(
// //                 "Resume information is required"
// //             );
// //         }

// //         const prompt = `
// // You are a professional ATS resume writer.

// // Create a clean, professional, ATS-friendly resume
// // for the target job.

// // IMPORTANT:

// // 1. Use ONLY the candidate information provided below.

// // 2. NEVER invent:
// //    - Name
// //    - Phone number
// //    - Email
// //    - Address
// //    - Skills
// //    - Experience
// //    - Projects
// //    - Education
// //    - Certifications
// //    - Companies
// //    - Dates

// // 3. If information is missing, DO NOT create fake information.

// // 4. Tailor the resume toward the target job description.

// // 5. Prioritize skills and projects that are genuinely present
// //    in the candidate information and relevant to the JD.

// // 6. Do not add technologies only because they appear in the JD.

// // 7. This is primarily for a fresher/early-career candidate.

// // 8. Use simple ATS-friendly HTML.

// // 9. Do not use:
// //    - Images
// //    - Icons
// //    - Tables for layout
// //    - JavaScript
// //    - External CSS
// //    - External fonts

// // 10. Use normal semantic HTML sections.

// // 11. Keep the resume approximately 1-2 pages.

// // 12. If a section has no information, omit that section.

// // 13. Return ONLY valid JSON.

// // Return exactly:

// // {
// //   "html": "<complete html document>"
// // }

// // ==============================
// // CANDIDATE RESUME / RAG CONTEXT
// // ==============================

// // ${resume || "No resume information provided."}

// // ==============================
// // SELF DESCRIPTION
// // ==============================

// // ${selfDescription || "No self description provided."}

// // ==============================
// // TARGET JOB
// // ==============================

// // ${jobDescription || "No target job provided."}
// // `;

// //         const messages = [
// //             {
// //                 role: "system",
// //                 content:
// //                     "You are an expert ATS resume writer. Return ONLY valid JSON with an html field.",
// //             },
// //             {
// //                 role: "user",
// //                 content: prompt,
// //             },
// //         ];

// //         const text =
// //             await callGroqWithRetry(
// //                 messages,
// //                 {
// //                     model:
// //                         "llama-3.3-70b-versatile",
// //                     temperature: 0.2,
// //                     max_tokens: 7000,
// //                 },
// //                 2
// //             );

// //         console.log(
// //             "AI PDF RESPONSE:",
// //             text.slice(0, 300)
// //         );

// //         const cleanJson =
// //             extractJson(text);

// //         let jsonContent;

// //         try {
// //             jsonContent =
// //                 JSON.parse(cleanJson);
// //         } catch (error) {
// //             console.error(
// //                 "PDF JSON PARSE ERROR:",
// //                 error.message
// //             );

// //             throw new Error(
// //                 "AI returned invalid PDF JSON"
// //             );
// //         }

// //         if (
// //             !jsonContent.html ||
// //             typeof jsonContent.html !==
// //                 "string"
// //         ) {
// //             throw new Error(
// //                 "AI response missing valid HTML"
// //             );
// //         }

// //         let htmlContent =
// //             jsonContent.html.trim();

// //         // If AI returns only body content,
// //         // wrap it into a valid document.
// //         if (
// //             !htmlContent
// //                 .toLowerCase()
// //                 .includes("<!doctype")
// //         ) {
// //             htmlContent = `
// // <!DOCTYPE html>
// // <html>
// // <head>
// // <meta charset="UTF-8">

// // <style>
// //     body {
// //         font-family: Arial, Helvetica, sans-serif;
// //         color: #111;
// //         background: #fff;
// //         margin: 0;
// //         padding: 0;
// //     }

// //     * {
// //         box-sizing: border-box;
// //     }
// // </style>

// // </head>

// // <body>

// // ${htmlContent}

// // </body>
// // </html>
// // `;
// //         }

// //         const pdfBuffer =
// //             await generatePdfFromHtml(
// //                 htmlContent
// //             );

// //         return pdfBuffer;

// //     } catch (error) {
// //         console.error(
// //             "AI SERVICE ERROR (PDF):",
// //             error
// //         );

// //         throw error;
// //     }
// // }

// // async function generateResumePdf({
// //     resume,
// //     relevantResumeContext,
// //     selfDescription,
// //     jobDescription,
// // }) {

// //     try {

// //         const prompt = `
// // You are a professional ATS resume writer.

// // Create a professional ATS-optimized resume for the candidate.

// // IMPORTANT RULES:

// // 1. Use ONLY information present in the supplied candidate data.
// // 2. NEVER invent:
// //    - companies
// //    - job experience
// //    - skills
// //    - projects
// //    - education
// //    - certifications
// //    - achievements
// //    - contact information
// // 3. The target job description should be used to tailor the resume.
// // 4. The RAG context contains resume information most relevant to the target job.
// // 5. Preserve factual information from the complete resume.
// // 6. Use RAG context to prioritize relevant skills and experience.
// // 7. Do not claim that a missing skill is possessed by the candidate.
// // 8. Keep the resume ATS-friendly.
// // 9. Keep it to 1-2 pages.
// // 10. Do not use tables for layout.
// // 11. Do not use images.
// // 12. Do not use JavaScript.
// // 13. All CSS must be inside <style>.
// // 14. Return ONLY valid JSON.

// // Return exactly:

// // {
// //   "html": "<complete html document>"
// // }

// // ========================
// // COMPLETE CANDIDATE RESUME
// // ========================

// // ${resume || "No resume provided."}

// // ========================
// // RAG RELEVANT RESUME CONTEXT
// // ========================

// // ${relevantResumeContext || "No additional RAG context available."}

// // ========================
// // SELF DESCRIPTION
// // ========================

// // ${selfDescription || "No self description provided."}

// // ========================
// // TARGET JOB DESCRIPTION
// // ========================

// // ${jobDescription || "No job description provided."}

// // ========================
// // REQUIRED RESUME SECTIONS
// // ========================

// // - Name and contact information if available
// // - Professional Summary
// // - Technical Skills
// // - Projects
// // - Experience if actually present
// // - Education
// // - Certifications if actually present

// // Make the summary and skills relevant to the target job,
// // but do not add skills that are not supported by the candidate data.
// // `;

// //         const messages = [

// //             {
// //                 role: "system",
// //                 content:
// //                     "You are an expert ATS resume writer. Return ONLY valid JSON."
// //             },

// //             {
// //                 role: "user",
// //                 content: prompt
// //             }

// //         ];

// //         const text =
// //             await callGroqWithRetry(
// //                 messages,
// //                 {
// //                     model:
// //                         "llama-3.3-70b-versatile",

// //                     temperature:
// //                         0.15,

// //                     max_tokens:
// //                         7000
// //                 }
// //             );

// //         console.log(
// //             "AI PDF RESPONSE:",
// //             text.slice(0, 300)
// //         );

// //         const cleanJson =
// //             extractJson(text);

// //         let jsonContent;

// //         try {

// //             jsonContent =
// //                 JSON.parse(cleanJson);

// //         } catch (error) {

// //             console.error(
// //                 "PDF JSON PARSE ERROR:",
// //                 error
// //             );

// //             throw new Error(
// //                 "AI returned invalid JSON for PDF."
// //             );
// //         }

// //         if (
// //             !jsonContent.html ||
// //             typeof jsonContent.html !== "string"
// //         ) {

// //             throw new Error(
// //                 "AI response missing valid html."
// //             );
// //         }

// //         let htmlContent =
// //             jsonContent.html.trim();

// //         if (
// //             !htmlContent
// //                 .toLowerCase()
// //                 .startsWith("<!doctype")
// //         ) {

// //             htmlContent =
// //                 `<!DOCTYPE html>
// //                 <html>
// //                 <head>
// //                     <meta charset="UTF-8">
// //                 </head>
// //                 <body>
// //                     ${htmlContent}
// //                 </body>
// //                 </html>`;
// //         }

// //         return await generatePdfFromHtml(
// //             htmlContent
// //         );

// //     } catch (error) {

// //         console.error(
// //             "AI SERVICE ERROR (PDF):",
// //             error
// //         );

// //         throw error;
// //     }
// // }


// async function generatePdfFromHtml(htmlContent) {

//     let browser;

//     try {

//         browser = await puppeteer.launch({
//             headless: true,

//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox",
//                 "--disable-dev-shm-usage",
//                 "--disable-gpu"
//             ]
//         });

//         const page = await browser.newPage();

//         await page.setViewport({
//             width: 1200,
//             height: 1600,
//             deviceScaleFactor: 1
//         });

//         await page.setContent(
//             htmlContent,
//             {
//                 waitUntil: "domcontentloaded",
//                 timeout: 30000
//             }
//         );

//         await page.emulateMediaType("print");

//         await page.evaluate(async () => {

//             if (document.fonts) {
//                 await document.fonts.ready;
//             }

//         });

//         const pdfBuffer = await page.pdf({
//             format: "A4",

//             printBackground: true,

//             preferCSSPageSize: true,

//             margin: {
//                 top: "12mm",
//                 bottom: "12mm",
//                 left: "12mm",
//                 right: "12mm"
//             },

//             timeout: 60000
//         });

//         if (!pdfBuffer || pdfBuffer.length === 0) {
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
//             error
//         );

//         throw new Error(
//             `PDF generation failed: ${error.message}`
//         );

//     } finally {

//         if (browser) {

//             try {
//                 await browser.close();

//             } catch (closeError) {

//                 console.error(
//                     "Browser close error:",
//                     closeError.message
//                 );

//             }
//         }
//     }
// }


// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {
//     generateInterviewReport,
//     generateResumePdf,
// };



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

// async function callGroqWithRetry(
//     messages,
//     options = {},
//     maxRetries = 2
// ) {

//     const {
//         model = "llama-3.3-70b-versatile",
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
//                         "llama-3.3-70b-versatile",

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
// // THIS FUNCTION WAS MISSING IN YOUR CURRENT FILE.
// // Your controller imports this function.
// // ======================================================

// async function generateResumePdf({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {

//     try {

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
// RESUME
// ========================

// ${resume || "No resume provided."}

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
//                         "llama-3.3-70b-versatile",

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

    matchScore: z.coerce.number().min(0).max(100),

    atsBreakdown: z.object({
        skillsMatch: z.coerce.number().min(0).max(100),
        experienceMatch: z.coerce.number().min(0).max(100),
        keywordMatch: z.coerce.number().min(0).max(100),
        educationMatch: z.coerce.number().min(0).max(100),
    }),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ).default([]),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ).default([]),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ).default([]),

    preparationPlan: z.array(
        z.object({
            day: z.coerce.number(),
            focus: z.string(),
            tasks: z.array(z.string()).default([]),
        })
    ).default([]),

    title: z.string(),
});


// ======================================================
// EXTRACT JSON
// ======================================================

function extractJson(text) {

    if (!text) {
        throw new Error("Empty AI response");
    }

    const stripped = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1 ||
        end <= start
    ) {
        throw new Error(
            "No valid JSON object found in AI response"
        );
    }

    return stripped.slice(start, end + 1);
}


// ======================================================
// GROQ WITH RETRY
// ======================================================
//
// NOTE: "llama-3.3-70b-versatile" was deprecated by Groq
// (announced June 17, 2026) and is no longer served on
// free/developer-tier keys. Using it causes every call to
// fail with a "model_decommissioned" error, which is what
// was breaking both report generation and PDF generation.
//
// Default model updated to Groq's recommended replacement.
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
    } = options;

    let lastError;

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {

        try {

            const response =
                await groq.chat.completions.create({

                    model,

                    messages,

                    temperature,

                    max_tokens,
                });

            const text =
                response?.choices?.[0]?.message?.content;

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

            if (attempt < maxRetries) {

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

        const prompt = `
You are an ATS resume analyzer helping a fresher.

Analyze the candidate profile against the target job description.

Return ONLY valid JSON.

Do not return markdown.
Do not return code fences.
Do not add explanations.

Rules:

1. matchScore must be 0-100.

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

6. Generate exactly 5 technical questions.

7. Generate exactly 4 behavioral questions.

8. Generate a practical 7-day preparation plan.

9. title must represent the target job role.

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

${jobDescription}
`;

        const messages = [

            {
                role: "system",

                content:
                    "You are an ATS analyzer. Return ONLY valid JSON.",
            },

            {
                role: "user",

                content: prompt,
            },

        ];

        const text =
            await callGroqWithRetry(
                messages,
                {
                    model:
                        "openai/gpt-oss-120b",

                    temperature: 0.2,

                    max_tokens: 4000,
                }
            );

        const cleanJson =
            extractJson(text);

        let data;

        try {

            data =
                JSON.parse(cleanJson);

        } catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                error.message
            );

            throw new Error(
                "AI returned malformed JSON"
            );
        }

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
                            (day.tasks || [])
                                .map(task =>
                                    typeof task === "string"
                                        ? task
                                        : JSON.stringify(task)
                                ),

                    })
                );
        }

        const validated =
            interviewReportSchema.parse(data);

        validated.matchScore =
            Math.min(
                100,
                Math.max(
                    0,
                    validated.matchScore
                )
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

async function generatePdfFromHtml(htmlContent) {

    let browser;

    try {

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

        const page =
            await browser.newPage();

        await page.setViewport({

            width: 1200,

            height: 1600,

            deviceScaleFactor: 1,

        });

        await page.setContent(
            htmlContent,
            {
                waitUntil:
                    "domcontentloaded",

                timeout: 30000,
            }
        );

        await page.emulateMediaType("print");

        await page.evaluate(
            async () => {

                if (document.fonts) {
                    await document.fonts.ready;
                }

            }
        );

        const pdfBuffer =
            await page.pdf({

                format: "A4",

                printBackground: true,

                preferCSSPageSize: true,

                margin: {

                    top: "12mm",

                    bottom: "12mm",

                    left: "12mm",

                    right: "12mm",

                },

                timeout: 60000,

            });

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
// FIX: this now accepts `relevantResumeContext` (already
// sent by the controller after RAG retrieval) and prefers
// it over the raw `resume` text when available, instead of
// silently ignoring it like before.
// ======================================================

async function generateResumePdf({
    resume,
    relevantResumeContext,
    selfDescription,
    jobDescription,
}) {

    try {

        // Prefer the job-relevant chunks pulled via RAG.
        // Fall back to the full raw resume if RAG context
        // wasn't available (e.g. no jobDescription at call time).
        const resumeForPrompt =
            (relevantResumeContext && relevantResumeContext.trim())
                ? relevantResumeContext
                : (resume || "");

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

Return ONLY valid JSON.

Do not return markdown.
Do not return code fences.
Do not add explanations.

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
RESUME (JOB-RELEVANT CONTEXT)
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

        const messages = [

            {
                role: "system",

                content:
                    "You are an ATS resume writer. Return ONLY valid JSON with an html field.",
            },

            {
                role: "user",

                content: prompt,
            },

        ];

        const text =
            await callGroqWithRetry(

                messages,

                {
                    model:
                        "openai/gpt-oss-120b",

                    temperature: 0.2,

                    max_tokens: 6000,
                }
            );

        console.log(
            "AI PDF RESPONSE:",
            text.slice(0, 200)
        );

        const cleanJson =
            extractJson(text);

        let jsonContent;

        try {

            jsonContent =
                JSON.parse(cleanJson);

        } catch (error) {

            console.error(
                "PDF JSON PARSE ERROR:",
                error.message
            );

            throw new Error(
                "AI returned invalid JSON for PDF"
            );
        }

        if (
            !jsonContent.html ||
            typeof jsonContent.html !== "string"
        ) {

            throw new Error(
                "AI response missing valid html field"
            );
        }

        let htmlContent =
            jsonContent.html.trim();

        // If AI returns only body content,
        // wrap it in a complete HTML document.

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
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
    margin: 0;
    padding: 0;
}

* {
    box-sizing: border-box;
}

</style>

</head>

<body>

${htmlContent}

</body>

</html>
`;
        }

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