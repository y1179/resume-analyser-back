# ResumeAI — Backend

AI-powered resume analysis and interview preparation API. Given a resume and a target job description, it generates an ATS match score, a tailored set of interview questions, a personalized prep roadmap, and a downloadable ATS-optimized resume PDF.

**Live API:** `https://resume-analyser-back.onrender.com`
**Frontend repo:** `https://github.com/y1179/resume-analyser-fr`
**Live demo:** `https://analyserresume.netlify.app/`

---

## ✨ Features

- **Resume parsing** — extracts text from uploaded PDF/DOCX resumes
- **RAG-based matching** — chunks the resume, embeds it, stores it in a vector DB, and retrieves only the chunks relevant to the target job description before generating the report (instead of dumping the whole resume into the prompt)
- **ATS match scoring** — an overall match score plus a breakdown across skills, experience, keywords, and education
- **Interview question generation** — technical and behavioral questions tailored to the job description, each with an intention and a model answer
- **7-day preparation roadmap** — a personalized, day-by-day study plan
- **Skill gap detection** — flags skills the job requires that the candidate's resume is missing
- **ATS resume PDF export** — generates a clean, ATS-friendly resume as a downloadable PDF using the candidate's real data (no invented experience)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Vector store | Pinecone |
| Embeddings | Local `all-MiniLM-L6-v2` (via `@xenova/transformers` or equivalent) |
| LLM | Groq API |
| Validation | Zod |
| Auth | HTTP-only cookie-based session |

---

## 📂 Project Structure

```
Backend/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── interviewReport.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   │
│   ├── services/
│   │   └── ai.service.js
│   │
│   ├── pinecone/
│   │   ├── pineconeClient.js
│   │   ├── storeResume.js
│   │   └── retrieveResume.js
│   │
│   ├── utils/
│   │   ├── embedding.js
│   │   ├── chunkText.js
│   │   └── extractText.js
│   │
│   └── server.js
├── .env
├── .gitignore
├── package.jso
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/` | Generate a new interview report from a resume/self-description + job description |
| `GET` | `/api/interview/` | Get all interview reports for the logged-in user |
| `GET` | `/api/interview/report/:interviewId` | Get a single interview report by ID |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download an ATS-optimized resume PDF for a given report |

All routes require authentication via an HTTP-only `token` cookie.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# LLM
GROQ_API_KEY=your_groq_api_key

# Vector DB
PINECONE_API_KEY=your_pinecone_api_key

# Frontend origin (for CORS)
FRONTEND_URL=https://your-frontend-url.netlify.app
```

> **Note:** the Pinecone index (`resume-index-384`, dimension `384`) must exist and match the output dimension of your embedding model before running the app.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone [your backend repo URL]
cd Backend

# Install dependencies
npm install

# Add your .env file (see above)

# Run in development
npm run dev

# Run in production
npm start
```

Server runs at `http://localhost:3000` by default.

---

## 🧠 How It Works (RAG Pipeline)

1. **Extract** — resume text is pulled from the uploaded PDF/DOCX
2. **Chunk** — the resume is split into smaller text chunks
3. **Embed** — each chunk is converted into a vector embedding
4. **Store** — embeddings are upserted into Pinecone, namespaced per user
5. **Retrieve** — when a job description is submitted, it's used as a query to fetch only the resume chunks most relevant to that specific job
6. **Generate** — the retrieved, job-relevant resume context (not the full resume) is passed to the LLM to generate the ATS report, questions, and roadmap

This keeps the AI's output grounded in the candidate's actual resume content and focused on what matters for the specific job, rather than relying on the full raw resume text every time.

---

## 📌 Known Considerations

- Embedding/report generation calls are subject to third-party rate limits; the service includes retry logic for transient failures.

---

