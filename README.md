# AI Resume Analyzer - Backend

## Overview

This repository contains the backend service for the AI Resume Analyzer application. The backend is responsible for handling API requests, processing resume and job description data, communicating with the Groq AI API, and storing application data in MongoDB.

The system analyzes resumes against job descriptions and generates insights such as skill matching, skill gaps, technical interview questions, behavioral interview questions, and improvement recommendations.

---

## Features

* RESTful API built with Node.js and Express.js
* Resume and Job Description processing
* AI-powered resume analysis using Groq AI
* Skill Match Detection
* Skill Gap Analysis
* Technical Interview Question Generation
* Behavioral Interview Question Generation
* Resume Improvement Suggestions
* MongoDB Database Integration

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Groq AI API
* dotenv
* CORS

---

## API Workflow

1. Receive Resume and Job Description from frontend.
2. Validate incoming request data.
3. Send analysis request to Groq AI.
4. Process AI response.
5. Return structured analysis results to frontend.

---

## Project Structure

backend/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── services/
├── .env
├── server.js
└── package.json

---

## Environment Variables

Create a `.env` file:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

---

## Installation

Clone the repository:

git clone <repository-url>

Install dependencies:

npm install

Run development server:

npm run dev

Run production server:

npm start

---

## Deployment

Backend deployed on Render.

---

## API Response Example

{
"matchScore": 82,
"matchingSkills": [
"React",
"JavaScript",
"Node.js"
],
"missingSkills": [
"Docker",
"AWS"
],
"technicalQuestions": [
"Explain React Hooks",
"What is JWT Authentication?"
],
"behavioralQuestions": [
"Describe a challenging project you worked on."
],
"suggestions": [
"Learn Docker fundamentals",
"Gain experience with AWS services"
]
}

---

## Author

Yas Patle
