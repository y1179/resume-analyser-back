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


require("dotenv").config();

async function generateEmbeddings(chunks) {
    const texts = chunks.map(chunk =>
        typeof chunk === "string" ? chunk : chunk.pageContent
    );

    const response = await fetch("https://api.jina.ai/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
        },
        body: JSON.stringify({
            model: "jina-embeddings-v3",
            input: texts,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    return data.data.map(item => item.embedding);
}

module.exports = {
    generateEmbeddings,
};