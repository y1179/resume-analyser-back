require("dotenv").config();

const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Connect to your index
const index = pinecone.index("resume-index");

module.exports = index;