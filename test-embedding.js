const { pipeline } = require("@huggingface/transformers");

async function testEmbedding() {
    try {
        console.log("Loading all-MiniLM-L6-v2...");

        const extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );

        console.log("Model loaded successfully!");

        const output = await extractor(
            "I am a full stack developer skilled in React and Node.js.",
            {
                pooling: "mean",
                normalize: true,
            }
        );

        const embedding = Array.from(output.data);

        console.log("SUCCESS!");
        console.log("Embedding dimension:", embedding.length);
        console.log("First 5 values:", embedding.slice(0, 5));

    } catch (error) {
        console.error("EMBEDDING TEST ERROR:", error);
    }
}

testEmbedding();