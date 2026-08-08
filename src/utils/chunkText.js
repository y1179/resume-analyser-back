
//testing 
// const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

// async function testChunk() {

//     const resumeText = `
//      name: John Doe
//     email: johndoe@example.com
//     Skills:
//     React.js
//     Node.js
//     Express.js
//     MongoDB
//     Docker
//     Groq AI

//     Projects:
//     AI Resume Analyzer
//     Food Delivery Application
//     Collaborative Code Editor

//     Education:
//     B.Tech Computer Science
//     `;

//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 100,
//         chunkOverlap: 20,
//     });

//     const chunks = await splitter.createDocuments([resumeText]);

//     console.log(chunks);
// }

// testChunk();

const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

async function chunkText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    return await splitter.createDocuments([text]);
}

module.exports = chunkText;