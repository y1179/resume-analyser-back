


// const index = require("./pineconeClient");

// const {
//     generateEmbeddings
// } = require("../utils/embedding");


// async function retrieveResume(
//     userId,
//     query
// ) {

//     try {

//         if (!userId) {
//             throw new Error(
//                 "User ID is required."
//             );
//         }

//         if (!query || !query.trim()) {
//             return [];
//         }

//         // -----------------------------------------
//         // GENERATE QUERY EMBEDDING
//         // -----------------------------------------

//         const [queryEmbedding] =
//             await generateEmbeddings(
//                 [query],
//                 "query"
//             );

//         if (!queryEmbedding) {
//             throw new Error(
//                 "Failed to generate query embedding."
//             );
//         }

//         console.log(
//             "Query embedding dimension:",
//             queryEmbedding.length
//         );

//         // -----------------------------------------
//         // SEARCH PINECONE
//         // -----------------------------------------

//         const response =
//             await index.query({

//                 vector:
//                     queryEmbedding,

//                 topK: 5,

//                 includeMetadata: true,

//                 filter: {
//                     userId:
//                         String(userId)
//                 }
//             });

//         if (
//             !response.matches ||
//             response.matches.length === 0
//         ) {

//             console.log(
//                 "No relevant resume chunks found."
//             );

//             return [];
//         }

//         return response.matches
//             .map((match) => ({

//                 text:
//                     match.metadata?.text ||
//                     "",

//                 score:
//                     match.score

//             }))
//             .filter(
//                 (item) => item.text
//             );

//     } catch (error) {

//         console.error(
//             "RETRIEVE_RESUME_ERROR:",
//             error
//         );

//         throw error;
//     }
// }


// module.exports =
//     retrieveResume;


// const index = require("./pineconeClient");

// const {
//     generateEmbeddings
// } = require("../utils/embedding");


// // =====================================================
// // RETRIEVE RESUME
// // =====================================================

// async function retrieveResume(
//     userId,
//     query
// ) {

//     try {

//         if (!userId) {

//             throw new Error(
//                 "User ID is required."
//             );

//         }


//         if (
//             !query ||
//             !query.trim()
//         ) {

//             return [];

//         }


//         // ---------------------------------------------
//         // GENERATE QUERY EMBEDDING
//         // ---------------------------------------------

//         const embeddings =
//             await generateEmbeddings([
//                 query
//             ]);


//         const queryEmbedding =
//             embeddings[0];


//         if (!queryEmbedding) {

//             throw new Error(
//                 "Failed to generate query embedding."
//             );

//         }


//         console.log(
//             "Query embedding dimension:",
//             queryEmbedding.length
//         );


//         // IMPORTANT:
//         // MiniLM = 384 dimensions

//         if (
//             queryEmbedding.length !== 384
//         ) {

//             throw new Error(
//                 `Invalid query embedding dimension. Expected 384, received ${queryEmbedding.length}.`
//             );

//         }


//         // ---------------------------------------------
//         // SEARCH PINECONE
//         // ---------------------------------------------

//         const response =
//             await index.query({

//                 vector:
//                     queryEmbedding,

//                 topK: 5,

//                 includeMetadata: true,

//                 filter: {
//                     userId:
//                         String(userId)
//                 }

//             });


//         // ---------------------------------------------
//         // NO RESULTS
//         // ---------------------------------------------

//         if (
//             !response.matches ||
//             response.matches.length === 0
//         ) {

//             console.log(
//                 "No relevant resume chunks found."
//             );

//             return [];

//         }


//         // ---------------------------------------------
//         // RETURN RESULTS
//         // ---------------------------------------------

//         return response.matches

//             .map((match) => ({

//                 text:
//                     match.metadata?.text ||
//                     "",

//                 score:
//                     match.score

//             }))

//             .filter(
//                 (item) =>
//                     item.text
//             );


//     } catch (error) {

//         console.error(
//             "RETRIEVE_RESUME_ERROR:",
//             error
//         );

//         throw error;
//     }
// }


// module.exports =
//     retrieveResume;


const index = require("./pineconeClient");

const {
    generateEmbeddings,
} = require("../utils/embedding");


// ======================================================
// RETRIEVE RESUME
// ======================================================

async function retrieveResume(
    userId,
    query
) {

    try {

        // ----------------------------------------------
        // VALIDATE USER
        // ----------------------------------------------

        if (!userId) {

            throw new Error(
                "User ID is required."
            );
        }


        // ----------------------------------------------
        // VALIDATE QUERY
        // ----------------------------------------------

        if (
            !query ||
            !query.trim()
        ) {

            return [];
        }


        // ----------------------------------------------
        // GENERATE QUERY EMBEDDING
        // ----------------------------------------------

        console.log(
            "Generating query embedding..."
        );

        const embeddings =
            await generateEmbeddings([
                query,
            ]);


        const queryEmbedding =
            embeddings[0];


        if (!queryEmbedding) {

            throw new Error(
                "Failed to generate query embedding."
            );
        }


        console.log(
            "Query embedding dimension:",
            queryEmbedding.length
        );


        // ----------------------------------------------
        // SEARCH PINECONE
        // ----------------------------------------------

        console.log(
            "Searching Pinecone..."
        );


        const response =
            await index.query({

                vector:
                    queryEmbedding,

                topK: 5,

                includeMetadata: true,

                filter: {
                    userId:
                        String(userId),
                },

            });


        // ----------------------------------------------
        // NO RESULTS
        // ----------------------------------------------

        if (
            !response.matches ||
            response.matches.length === 0
        ) {

            console.log(
                "No relevant resume chunks found."
            );

            return [];
        }


        // ----------------------------------------------
        // FORMAT RESULTS
        // ----------------------------------------------

        const results =
            response.matches

                .map((match) => ({

                    text:
                        match.metadata?.text ||
                        "",

                    score:
                        match.score,

                }))

                .filter(
                    (item) =>
                        item.text
                );


        console.log(
            "Relevant chunks:",
            results.length
        );


        return results;


    } catch (error) {

        console.error(
            "RETRIEVE_RESUME_ERROR:",
            error
        );

        throw error;
    }
}


// ======================================================
// EXPORT
// ======================================================

module.exports =
    retrieveResume;