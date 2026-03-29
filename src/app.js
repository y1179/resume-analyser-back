// const express = require("express")
// const cookieParser = require("cookie-parser")
// const cors = require("cors")

// const app = express()

// app.use(express.json())
// app.use(cookieParser())
// app.use(cors({
//     origin: "http://localhost:5173",""http://localhost:5173",            // Local Development
//     "https://analyserresume.netlify.app" // Production (Netlify)"
//     credentials: true
// }))

// /* require all the routes here */
// const authRouter = require("./routes/auth.routes")
// const interviewRouter = require("./routes/interview.routes")


// /* using all the routes here */
// app.use("/api/auth", authRouter)
// app.use("/api/interview", interviewRouter)



// module.exports = app
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// 1. Define your allowed origins in an array
const allowedOrigins = [
    "http://localhost:5173",
    "https://analyserresume.netlify.app"
];

app.use(express.json())
app.use(cookieParser())

// 2. Updated CORS logic to handle multiple origins
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app