// require("dotenv").config();

// async function test() {
//   try {
//     const response = await fetch("https://api.jina.ai/v1/embeddings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "jina-embeddings-v3",
//         input: ["React Node.js MongoDB Docker"],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//     }

//     const data = await response.json();

//     const vector = data.data[0].embedding;

//     console.log("Dimensions:", vector.length);
//     console.log("First 5 values:", vector.slice(0, 5));

//   } catch (err) {
//     console.error(err);
//   }
// }

// test();


// require("dotenv").config();

// async function generateEmbeddings(chunks) {
//     const texts = chunks.map(chunk =>
//         typeof chunk === "string" ? chunk : chunk.pageContent
//     );

//     const response = await fetch("https://api.jina.ai/v1/embeddings", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: "jina-embeddings-v3",
//             input: texts,
//         }),
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//     }

//     const data = await response.json();

//     return data.data.map(item => item.embedding);
// }

// module.exports = {
//     generateEmbeddings,
// };


// require("dotenv").config();

// const VOYAGE_API_URL =
//     "https://api.voyageai.com/v1/embeddings";

// const VOYAGE_MODEL =
//     process.env.VOYAGE_EMBEDDING_MODEL || "voyage-4-lite";

// async function generateEmbeddings(chunks, inputType = "document") {

//     if (!process.env.VOYAGE_API_KEY) {
//         throw new Error(
//             "VOYAGE_API_KEY is not configured in environment variables."
//         );
//     }

//     if (!Array.isArray(chunks) || chunks.length === 0) {
//         return [];
//     }

//     const texts = chunks
//         .map((chunk) => {
//             if (typeof chunk === "string") {
//                 return chunk;
//             }

//             return (
//                 chunk?.pageContent ||
//                 chunk?.text ||
//                 ""
//             );
//         })
//         .map((text) => text.trim())
//         .filter(Boolean);

//     if (texts.length === 0) {
//         return [];
//     }

//     if (
//         inputType !== "document" &&
//         inputType !== "query"
//     ) {
//         throw new Error(
//             `Invalid Voyage input type: ${inputType}`
//         );
//     }

//     try {

//         console.log(
//             `Generating ${inputType} embeddings using ${VOYAGE_MODEL}...`
//         );

//         const response = await fetch(
//             VOYAGE_API_URL,
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization":
//                         `Bearer ${process.env.VOYAGE_API_KEY}`,
//                 },

//                 body: JSON.stringify({
//                     input: texts,

//                     model: VOYAGE_MODEL,

//                     input_type: inputType,

//                     output_dimension: 1024,

//                     output_dtype: "float",
//                 }),
//             }
//         );

//         const responseText =
//             await response.text();

//         if (!response.ok) {

//             console.error(
//                 "VOYAGE API ERROR:",
//                 response.status,
//                 responseText
//             );

//             throw new Error(
//                 `Voyage API error ${response.status}: ${responseText}`
//             );
//         }

//         const data =
//             JSON.parse(responseText);

//         if (
//             !data.data ||
//             !Array.isArray(data.data)
//         ) {
//             throw new Error(
//                 "Voyage API returned an invalid embedding response."
//             );
//         }

//         const embeddings =
//             data.data.map(
//                 (item) => item.embedding
//             );

//         if (
//             embeddings.length !== texts.length
//         ) {
//             throw new Error(
//                 `Embedding count mismatch. Expected ${texts.length}, received ${embeddings.length}.`
//             );
//         }

//         console.log(
//             `Generated ${embeddings.length} embeddings.`
//         );

//         console.log(
//             "Embedding dimension:",
//             embeddings[0]?.length
//         );

//         return embeddings;

//     } catch (error) {

//         console.error(
//             "GENERATE_EMBEDDINGS_ERROR:",
//             error
//         );

//         throw error;
//     }
// }

// module.exports = {
//     generateEmbeddings,
// };


require("dotenv").config();

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";

async function generateEmbeddings(chunks) {
    try {
        if (!process.env.VOYAGE_API_KEY) {
            throw new Error("VOYAGE_API_KEY is not configured.");
        }

        const texts = chunks
            .map((chunk) => {
                if (typeof chunk === "string") {
                    return chunk;
                }

                return chunk?.pageContent || chunk?.text || "";
            })
            .map((text) => text.trim())
            .filter(Boolean);

        if (texts.length === 0) {
            throw new Error("No text available for embedding.");
        }

        // IMPORTANT:
        // trim() removes accidental spaces/newlines from Render env variables.
        const model = (
            process.env.VOYAGE_MODEL || "voyage-4-lite"
        ).trim();

        console.log("Voyage embedding model:", JSON.stringify(model));
        console.log("Embedding text count:", texts.length);

        const response = await fetch(
            VOYAGE_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.VOYAGE_API_KEY}`,
                },

                body: JSON.stringify({
                    input: texts,
                    model: model,
                }),
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(
                `Voyage API error ${response.status}: ${responseText}`
            );
        }

        let data;

        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error(
                "Voyage API returned invalid JSON."
            );
        }

        if (
            !data ||
            !Array.isArray(data.data)
        ) {
            throw new Error(
                "Voyage API did not return embeddings."
            );
        }

        const embeddings = data.data.map(
            (item) => item.embedding
        );

        if (
            embeddings.length !== texts.length
        ) {
            throw new Error(
                `Embedding count mismatch. Expected ${texts.length}, received ${embeddings.length}.`
            );
        }

        console.log(
            "Embeddings generated successfully:",
            embeddings.length
        );

        return embeddings;

    } catch (error) {

        console.error(
            "GENERATE_EMBEDDINGS_ERROR:",
            error
        );

        throw error;
    }
}

module.exports = {
    generateEmbeddings,
};