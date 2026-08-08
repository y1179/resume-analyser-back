// const index = require("./pineconeClient");

// /**
//  * Store resume chunks in Pinecone
//  * @param {string} userId
//  * @param {Array} chunks
//  * @param {Array} embeddings
//  */
// async function storeResume(userId, chunks, embeddings) {
//     try {

//         // Create vectors for Pinecone
//         const vectors = chunks.map((chunk, indexNo) => ({
//             id: `${userId}-chunk-${indexNo + 1}`,

//             values: embeddings[indexNo],

//             metadata: {
//                 userId,
//                 text: chunk.pageContent,
//                 chunkNumber: indexNo + 1
//             }
//         }));

//         // Store all vectors
//         await index.upsert(vectors);

//         console.log("Resume stored successfully in Pinecone");

//     } catch (error) {
//         console.error("STORE RESUME ERROR:", error);
//         throw error;
//     }
// }

// module.exports = storeResume;


const index = require("./pineconeClient");

async function storeResume(userId, chunks, embeddings) {
    try {

        // Delete old resume vectors for this user
        await index.deleteMany({
            filter: {
                userId: userId,
            },
        });

        // Create vectors
        const vectors = chunks.map((chunk, indexNo) => ({
            id: `${userId}-chunk-${indexNo + 1}`,

            values: embeddings[indexNo],

            metadata: {
                userId,
                text: chunk.pageContent,
                chunkNumber: indexNo + 1,
                uploadedAt: new Date().toISOString(),
            },
        }));

        // Store vectors
        await index.upsert(vectors);

        console.log("Resume stored successfully.");

    } catch (error) {
        console.error("STORE_RESUME_ERROR:", error);
        throw error;
    }
}

module.exports = storeResume;