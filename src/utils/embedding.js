const { HuggingFaceInferenceEmbeddings } = require("@langchain/huggingface");

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: "BAAI/bge-small-en-v1.5",
});

async function generateEmbeddings(chunks) {

    const vectors = await embeddings.embedDocuments(
        chunks.map(chunk => chunk.pageContent)
    );

    return vectors;
}

module.exports = generateEmbeddings;