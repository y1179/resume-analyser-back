// require("dotenv").config();

// const { Pinecone } = require("@pinecone-database/pinecone");

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// // Connect to your index
// const index = pinecone.index("resume-index");

// module.exports = index;


// require("dotenv").config();

// const {
//     Pinecone
// } = require("@pinecone-database/pinecone");


// if (!process.env.PINECONE_API_KEY) {

//     throw new Error(
//         "PINECONE_API_KEY is not configured."
//     );

// }


// const pinecone =
//     new Pinecone({

//         apiKey:
//             process.env.PINECONE_API_KEY,

//     });


// const index =
//     pinecone.index(
//         "resume-index-384"
//     );


// module.exports = index;


// require("dotenv").config();

// const {
//     Pinecone,
// } = require("@pinecone-database/pinecone");


// // ======================================================
// // PINECONE CLIENT
// // ======================================================

// const pinecone =
//     new Pinecone({
//         apiKey:
//             process.env.PINECONE_API_KEY,
//     });


// // ======================================================
// // PINECONE INDEX
// // ======================================================

// const index =
//     pinecone.index(
//         "resume-index-384"
//     );


// // ======================================================
// // EXPORT
// // ======================================================

// module.exports = index;


require("dotenv").config();

const {
    Pinecone
} = require("@pinecone-database/pinecone");


const pinecone =
    new Pinecone({
        apiKey:
            process.env.PINECONE_API_KEY
    });


const index =
    pinecone.index("resume-index-384");


module.exports = index;