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


// const index = require("./pineconeClient");

// async function storeResume(userId, chunks, embeddings) {
//     try {

//         // Delete old resume vectors for this user
//         await index.deleteMany({
//             filter: {
//                 userId: userId,
//             },
//         });

//         // Create vectors
//         const vectors = chunks.map((chunk, indexNo) => ({
//             id: `${userId}-chunk-${indexNo + 1}`,

//             values: embeddings[indexNo],

//             metadata: {
//                 userId,
//                 text: chunk.pageContent,
//                 chunkNumber: indexNo + 1,
//                 uploadedAt: new Date().toISOString(),
//             },
//         }));

//         // Store vectors
//         await index.upsert(vectors);

//         console.log("Resume stored successfully.");

//     } catch (error) {
//         console.error("STORE_RESUME_ERROR:", error);
//         throw error;
//     }
// }

// module.exports = storeResume;


// const index = require("./pineconeClient");
// const {
//     generateEmbeddings
// } = require("../utils/embedding");


// async function storeResume(
//     userId,
//     chunks,
//     embeddings
// ) {

//     try {

//         if (!userId) {
//             throw new Error(
//                 "User ID is required."
//             );
//         }

//         if (
//             !Array.isArray(chunks) ||
//             chunks.length === 0
//         ) {
//             throw new Error(
//                 "No resume chunks provided."
//             );
//         }

//         if (
//             !Array.isArray(embeddings) ||
//             embeddings.length === 0
//         ) {
//             throw new Error(
//                 "No embeddings provided."
//             );
//         }

//         if (
//             chunks.length !== embeddings.length
//         ) {
//             throw new Error(
//                 `Chunks and embeddings count mismatch. Chunks: ${chunks.length}, Embeddings: ${embeddings.length}`
//             );
//         }

//         const vectors = chunks.map(
//             (chunk, index) => {

//                 const text =
//                     typeof chunk === "string"
//                         ? chunk
//                         : (
//                             chunk?.pageContent ||
//                             chunk?.text ||
//                             ""
//                         );

//                 return {

//                     id:
//                         `${userId}-${Date.now()}-${index}`,

//                     values:
//                         embeddings[index],

//                     metadata: {

//                         userId:

//                             String(userId),

//                         text:

//                             text,

//                         chunkIndex:

//                             index,
//                     }
//                 };
//             }
//         );

//         console.log(
//             "Preparing Pinecone vectors:",
//             vectors.length
//         );

//         console.log(
//             "Vector dimension:",
//             vectors[0]?.values?.length
//         );

//         // -----------------------------------------
//         // UPSERT IN BATCHES
//         // -----------------------------------------

//         const batchSize = 100;

//         for (
//             let i = 0;
//             i < vectors.length;
//             i += batchSize
//         ) {

//             const batch =
//                 vectors.slice(
//                     i,
//                     i + batchSize
//                 );

//             await index.upsert(
//                 batch
//             );

//             console.log(
//                 `Pinecone upserted ${i + batch.length}/${vectors.length}`
//             );
//         }

//         console.log(
//             "Resume stored successfully in Pinecone."
//         );

//         return true;

//     } catch (error) {

//         console.error(
//             "STORE_RESUME_ERROR:",
//             error
//         );

//         throw error;
//     }
// }


// module.exports = storeResume;



const index = require("./pineconeClient");

async function storeResume(
    userId,
    chunks,
    embeddings
) {
    try {

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!userId) {
            throw new Error(
                "User ID is required."
            );
        }

        if (
            !Array.isArray(chunks) ||
            chunks.length === 0
        ) {
            throw new Error(
                "No resume chunks provided."
            );
        }

        if (
            !Array.isArray(embeddings) ||
            embeddings.length === 0
        ) {
            throw new Error(
                "No embeddings provided."
            );
        }

        if (
            chunks.length !== embeddings.length
        ) {
            throw new Error(
                `Chunks and embeddings count mismatch. Chunks: ${chunks.length}, Embeddings: ${embeddings.length}`
            );
        }

        // =====================================================
        // CREATE PINECONE VECTORS
        // =====================================================

        const timestamp = Date.now();

        const vectors = chunks
            .map((chunk, chunkIndex) => {

                const text =
                    typeof chunk === "string"
                        ? chunk
                        : (
                            chunk?.pageContent ||
                            chunk?.text ||
                            ""
                        );

                const embedding =
                    embeddings[chunkIndex];

                // ---------------------------------------------
                // Validate text
                // ---------------------------------------------

                if (!text || !text.trim()) {
                    console.warn(
                        `Skipping chunk ${chunkIndex}: empty text.`
                    );

                    return null;
                }

                // ---------------------------------------------
                // Validate embedding
                // ---------------------------------------------

                if (
                    !Array.isArray(embedding) ||
                    embedding.length === 0
                ) {
                    console.warn(
                        `Skipping chunk ${chunkIndex}: invalid embedding.`
                    );

                    return null;
                }

                return {
                    id:
                        `${userId}-${timestamp}-${chunkIndex}`,

                    values:
                        embedding,

                    metadata: {
                        userId:
                            String(userId),

                        text:
                            text.trim(),

                        chunkIndex:
                            chunkIndex
                    }
                };
            })
            .filter(Boolean);

        // =====================================================
        // FINAL VECTOR VALIDATION
        // =====================================================

        console.log(
            "Preparing Pinecone vectors:",
            vectors.length
        );

        if (vectors.length === 0) {
            throw new Error(
                "No valid Pinecone vectors were created."
            );
        }

        const vectorDimension =
            vectors[0]?.values?.length;

        console.log(
            "Vector dimension:",
            vectorDimension
        );

        if (!vectorDimension) {
            throw new Error(
                "Pinecone vector dimension could not be determined."
            );
        }

        // Make sure every vector has the same dimension
        const invalidVector =
            vectors.find(
                (vector) =>
                    vector.values.length !==
                    vectorDimension
            );

        if (invalidVector) {
            throw new Error(
                "Embedding vectors have inconsistent dimensions."
            );
        }

        // =====================================================
        // UPSERT IN BATCHES
        // =====================================================

        const batchSize = 100;
        for (
    let i = 0;
    i < vectors.length;
    i += batchSize
) {
    const batch = vectors.slice(
        i,
        i + batchSize
    );

    if (
        !Array.isArray(batch) ||
        batch.length === 0
    ) {
        continue;
    }

    console.log(
        `Uploading Pinecone batch: ${i + 1}-${i + batch.length}`
    );

    await index.upsert({
        records: batch
    });

    console.log(
        `Pinecone upserted ${i + batch.length}/${vectors.length}`
    );
}
        // for (
        //     let i = 0;
        //     i < vectors.length;
        //     i += batchSize
        // ) {

        //     const batch =
        //         vectors.slice(
        //             i,
        //             i + batchSize
        //         );

        //     // Never send an empty batch to Pinecone
        //     if (
        //         !Array.isArray(batch) ||
        //         batch.length === 0
        //     ) {
        //         continue;
        //     }

        //     console.log(
        //         `Uploading Pinecone batch: ${i + 1}-${i + batch.length}`
        //     );

        //     await index.upsert(batch);

        //     console.log(
        //         `Pinecone upserted ${i + batch.length}/${vectors.length}`
        //     );
        // }

        // =====================================================
        // SUCCESS
        // =====================================================

        console.log(
            "Resume stored successfully in Pinecone."
        );

        return true;

    } catch (error) {

        console.error(
            "STORE_RESUME_ERROR:",
            error
        );

        throw error;
    }
}

module.exports = storeResume;