

// const index = require("./pineconeClient");

// async function storeResume(
//     userId,
//     chunks,
//     embeddings
// ) {
//     try {

//         // =====================================================
//         // VALIDATION
//         // =====================================================

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

//         // =====================================================
//         // CREATE PINECONE VECTORS
//         // =====================================================

//         const timestamp = Date.now();

//         const vectors = chunks
//             .map((chunk, chunkIndex) => {

//                 const text =
//                     typeof chunk === "string"
//                         ? chunk
//                         : (
//                             chunk?.pageContent ||
//                             chunk?.text ||
//                             ""
//                         );

//                 const embedding =
//                     embeddings[chunkIndex];

//                 // ---------------------------------------------
//                 // Validate text
//                 // ---------------------------------------------

//                 if (!text || !text.trim()) {
//                     console.warn(
//                         `Skipping chunk ${chunkIndex}: empty text.`
//                     );

//                     return null;
//                 }

//                 // ---------------------------------------------
//                 // Validate embedding
//                 // ---------------------------------------------

//                 if (
//                     !Array.isArray(embedding) ||
//                     embedding.length === 0
//                 ) {
//                     console.warn(
//                         `Skipping chunk ${chunkIndex}: invalid embedding.`
//                     );

//                     return null;
//                 }

//                 return {
//                     id:
//                         `${userId}-${timestamp}-${chunkIndex}`,

//                     values:
//                         embedding,

//                     metadata: {
//                         userId:
//                             String(userId),

//                         text:
//                             text.trim(),

//                         chunkIndex:
//                             chunkIndex
//                     }
//                 };
//             })
//             .filter(Boolean);

//         // =====================================================
//         // FINAL VECTOR VALIDATION
//         // =====================================================

//         console.log(
//             "Preparing Pinecone vectors:",
//             vectors.length
//         );

//         if (vectors.length === 0) {
//             throw new Error(
//                 "No valid Pinecone vectors were created."
//             );
//         }

//         const vectorDimension =
//             vectors[0]?.values?.length;

//         console.log(
//             "Vector dimension:",
//             vectorDimension
//         );

//         if (!vectorDimension) {
//             throw new Error(
//                 "Pinecone vector dimension could not be determined."
//             );
//         }

//         // Make sure every vector has the same dimension
//         const invalidVector =
//             vectors.find(
//                 (vector) =>
//                     vector.values.length !==
//                     vectorDimension
//             );

//         if (invalidVector) {
//             throw new Error(
//                 "Embedding vectors have inconsistent dimensions."
//             );
//         }

//         // =====================================================
//         // UPSERT IN BATCHES
//         // =====================================================

//         const batchSize = 100;
//         for (
//     let i = 0;
//     i < vectors.length;
//     i += batchSize
// ) {
//     const batch = vectors.slice(
//         i,
//         i + batchSize
//     );

//     if (
//         !Array.isArray(batch) ||
//         batch.length === 0
//     ) {
//         continue;
//     }

//     console.log(
//         `Uploading Pinecone batch: ${i + 1}-${i + batch.length}`
//     );

//     await index.upsert({
//         records: batch
//     });

//     console.log(
//         `Pinecone upserted ${i + batch.length}/${vectors.length}`
//     );
// }
//         // for (
//         //     let i = 0;
//         //     i < vectors.length;
//         //     i += batchSize
//         // ) {

//         //     const batch =
//         //         vectors.slice(
//         //             i,
//         //             i + batchSize
//         //         );

//         //     // Never send an empty batch to Pinecone
//         //     if (
//         //         !Array.isArray(batch) ||
//         //         batch.length === 0
//         //     ) {
//         //         continue;
//         //     }

//         //     console.log(
//         //         `Uploading Pinecone batch: ${i + 1}-${i + batch.length}`
//         //     );

//         //     await index.upsert(batch);

//         //     console.log(
//         //         `Pinecone upserted ${i + batch.length}/${vectors.length}`
//         //     );
//         // }

//         // =====================================================
//         // SUCCESS
//         // =====================================================

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



// const index = require("./pineconeClient");

// const {
//     generateEmbeddings
// } = require("../utils/embedding");


// // =====================================================
// // STORE RESUME
// // =====================================================

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
//             chunks.length !==
//             embeddings.length
//         ) {

//             throw new Error(
//                 `Chunks and embeddings count mismatch. Chunks: ${chunks.length}, Embeddings: ${embeddings.length}`
//             );

//         }


//         // ---------------------------------------------
//         // VALIDATE DIMENSION
//         // ---------------------------------------------

//         for (
//             let i = 0;
//             i < embeddings.length;
//             i++
//         ) {

//             if (
//                 !Array.isArray(
//                     embeddings[i]
//                 )
//             ) {

//                 throw new Error(
//                     `Embedding ${i} is not an array.`
//                 );

//             }


//             if (
//                 embeddings[i].length !== 384
//             ) {

//                 throw new Error(
//                     `Invalid embedding dimension at index ${i}. Expected 384, received ${embeddings[i].length}.`
//                 );

//             }

//         }


//         // ---------------------------------------------
//         // CREATE PINECONE VECTORS
//         // ---------------------------------------------

//         const vectors =
//             chunks.map(
//                 (chunk, index) => {

//                     const text =
//                         typeof chunk === "string"
//                             ? chunk
//                             : (
//                                 chunk?.pageContent ||
//                                 chunk?.text ||
//                                 ""
//                             );


//                     return {

//                         id:
//                             `${userId}-${Date.now()}-${index}`,

//                         values:
//                             embeddings[index],

//                         metadata: {

//                             userId:
//                                 String(userId),

//                             text:
//                                 text,

//                             chunkIndex:
//                                 index

//                         }

//                     };

//                 }
//             );


//         console.log(
//             "Preparing Pinecone vectors:",
//             vectors.length
//         );


//         console.log(
//             "Vector dimension:",
//             vectors[0]?.values?.length
//         );


//         // ---------------------------------------------
//         // UPSERT IN BATCHES
//         // ---------------------------------------------

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


//             if (
//                 batch.length === 0
//             ) {

//                 continue;

//             }


//             console.log(
//                 `Uploading Pinecone batch: ${i + 1}-${i + batch.length}`
//             );


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


// module.exports =
//     storeResume;

const index = require("./pineconeClient");


// =====================================================
// STORE RESUME
// =====================================================

async function storeResume(
    userId,
    chunks,
    embeddings
) {

    try {

        // ---------------------------------------------
        // VALIDATE USER
        // ---------------------------------------------

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        // ---------------------------------------------
        // VALIDATE CHUNKS
        // ---------------------------------------------

        if (
            !Array.isArray(chunks) ||
            chunks.length === 0
        ) {

            throw new Error(
                "No resume chunks provided."
            );
        }


        // ---------------------------------------------
        // VALIDATE EMBEDDINGS
        // ---------------------------------------------

        if (
            !Array.isArray(embeddings) ||
            embeddings.length === 0
        ) {

            throw new Error(
                "No embeddings provided."
            );
        }


        // ---------------------------------------------
        // CHECK CHUNK / EMBEDDING COUNT
        // ---------------------------------------------

        if (
            chunks.length !==
            embeddings.length
        ) {

            throw new Error(
                `Chunks and embeddings count mismatch. ` +
                `Chunks: ${chunks.length}, ` +
                `Embeddings: ${embeddings.length}`
            );
        }


        // ---------------------------------------------
        // VALIDATE EMBEDDING DIMENSIONS
        // ---------------------------------------------

        const EXPECTED_DIMENSION = 384;


        for (
            let i = 0;
            i < embeddings.length;
            i++
        ) {

            if (
                !Array.isArray(
                    embeddings[i]
                )
            ) {

                throw new Error(
                    `Embedding ${i} is not an array.`
                );
            }


            if (
                embeddings[i].length !==
                EXPECTED_DIMENSION
            ) {

                throw new Error(
                    `Invalid embedding dimension at index ${i}. ` +
                    `Expected ${EXPECTED_DIMENSION}, ` +
                    `received ${embeddings[i].length}.`
                );
            }
        }


        // ---------------------------------------------
        // CREATE PINECONE VECTORS
        // ---------------------------------------------

        const vectors =
            chunks.map(
                (chunk, chunkIndex) => {

                    const text =
                        typeof chunk === "string"
                            ? chunk
                            : (
                                chunk?.pageContent ||
                                chunk?.text ||
                                ""
                            );


                    return {

                        id:
                            `${userId}-${Date.now()}-${chunkIndex}`,

                        values:
                            embeddings[chunkIndex],

                        metadata: {

                            userId:
                                String(userId),

                            text:
                                text,

                            chunkIndex:
                                chunkIndex

                        }

                    };
                }
            );


        // ---------------------------------------------
        // VALIDATE VECTORS
        // ---------------------------------------------

        if (
            vectors.length === 0
        ) {

            throw new Error(
                "No Pinecone vectors were created."
            );
        }


        console.log(
            "Preparing Pinecone vectors:",
            vectors.length
        );


        console.log(
            "Vector dimension:",
            vectors[0]?.values?.length
        );


        // ---------------------------------------------
        // UPSERT TO PINECONE
        // ---------------------------------------------

        const batchSize = 100;


        for (
            let i = 0;
            i < vectors.length;
            i += batchSize
        ) {

            const batch =
                vectors.slice(
                    i,
                    i + batchSize
                );


            if (
                batch.length === 0
            ) {

                continue;
            }


            console.log(
                `Uploading Pinecone batch: ` +
                `${i + 1}-${i + batch.length}`
            );


            await index.upsert(
                batch
            );


            console.log(
                `Pinecone upserted ` +
                `${i + batch.length}/${vectors.length}`
            );
        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

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


// =====================================================
// EXPORT
// =====================================================

module.exports =
    storeResume;