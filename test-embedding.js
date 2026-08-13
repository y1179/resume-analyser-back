require("dotenv").config();

const { generateEmbeddings } = require("./src/utils/embedding");

async function test() {
    try {
        console.log("Testing Voyage embedding...");

        const result = await generateEmbeddings([
            "I am a React and Node.js developer."
        ]);

        console.log("SUCCESS!");
        console.log("Number of embeddings:", result.length);
        console.log("Embedding dimension:", result[0].length);

    } catch (error) {
        console.error("TEST FAILED:");
        console.error(error);
    }
}

test();