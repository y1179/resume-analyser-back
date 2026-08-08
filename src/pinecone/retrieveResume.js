// const index = require("./pineconeClient");
// const { generateEmbeddings } = require("../utils/embedding");

// /**
//  * Retrieve relevant resume chunks using Job Description
//  * @param {string} userId
//  * @param {string} query
//  * @returns {Array}
//  */
// async function retrieveResume(userId, query) {
//     try {

//         // Generate embedding for Job Description
//         const embedding = await generateEmbeddings([query]);

//         // Search Pinecone
//         const response = await index.query({
//             vector: embedding[0],
//             topK: 5,
//             includeMetadata: true,
//             filter: {
//                 userId: userId
//             }
//         });

//         // Extract only resume text
//         const relevantChunks = response.matches.map(match => ({
//             text: match.metadata.text,
//             score: match.score
//         }));

//         return relevantChunks;

//     } catch (error) {
//         console.error("RETRIEVE RESUME ERROR:", error);
//         throw error;
//     }
// }

// module.exports = retrieveResume;


const index = require("./pineconeClient");
const { generateEmbeddings } = require("../utils/embedding");

async function retrieveResume(userId, query) {
    try {

        // Generate embedding for Job Description
        const [queryEmbedding] = await generateEmbeddings([query]);

        // Search Pinecone
        const response = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true,
            filter: {
                userId: userId,
            },
        });

        if (!response.matches || response.matches.length === 0) {
            return [];
        }

        return response.matches.map((match) => ({
            text: match.metadata.text,
            score: match.score,
        }));

    } catch (error) {
        console.error("RETRIEVE_RESUME_ERROR:", error);
        throw error;
    }
}

module.exports = retrieveResume;