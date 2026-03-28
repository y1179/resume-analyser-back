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



const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer"); // ✅ Added missing import

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Schema for Interview Report
const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
  title: z.string(),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const prompt = `
You are an expert technical interviewer.
Return ONLY valid JSON. No explanation.

STRICT RULES:
- matchScore should be between 0–100
- Return JSON in this exact structure:
{
  "matchScore": number,
  "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
  "preparationPlan": [{ "day": number, "focus": "", "tasks": ["string"] }],
  "title": ""
}

Candidate Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    // ✅ Clean potential markdown backticks from AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    let data = JSON.parse(cleanJson);

    // Normalize tasks
    if (data.preparationPlan) {
      data.preparationPlan = data.preparationPlan.map((day) => ({
        ...day,
        tasks: (day.tasks || []).map(task => typeof task === 'string' ? task : JSON.stringify(task))
      }));
    }

    return interviewReportSchema.parse(data);
  } catch (error) {
    console.error("AI SERVICE ERROR (Report):", error);
    throw new Error("Failed to generate interview report");
  }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate a professional resume in HTML format.
            Return ONLY a JSON object: {"html": "your_html_string_here"}
            
            Resume Data: ${resume}
            Self Description: ${selfDescription}
            Target Job: ${jobDescription}

            Requirements:
            - Professional CSS styling included in <style> tags.
            - ATS friendly.
            - 1-2 pages maximum.
        `;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        // ✅ FIX: Use choices[0].message.content instead of .text
        const text = response.choices[0].message.content;

        // ✅ Extract JSON from potential Markdown wrappers
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : text;
        
        const jsonContent = JSON.parse(cleanJson);

        if (!jsonContent.html) throw new Error("AI response missing 'html' field");

        return await generatePdfFromHtml(jsonContent.html);

    } catch (error) {
        console.error("AI SERVICE ERROR (PDF):", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };