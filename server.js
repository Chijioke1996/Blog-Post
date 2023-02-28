const express = require("express")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const articlesRouter = require("./routes/articles")
const articleDatabase = require("./models/articles")
const methodOverride = require("method-override")

app.use(methodOverride("_method"))
mongoose.set('strictQuery', false)

app.use(express.urlencoded( {extended: false}))

app.use("/article", articlesRouter)

app.set("view engine", "ejs")

// const articles = [
//     {
//         title: "Test Article 1",
//         createdAt: new Date(),
//         discription: "Form controls are styled with a mix of Sass and CSS variables, allowing them to adapt to color modes and support any customization method."
//     },

//     {
//         title: "Test Article 1",
//         createdAt: new Date(),
//         discription: "Form controls are styled with a mix of Sass and CSS variables, allowing them to adapt to color modes and support any customization method."
//     }
// ]



// GET for rendering Index.ejs
app.get("/", async (req, res) => {
    const articles = await articleDatabase.find().sort({ createdAt: "descending"})
    res.render("articles/index", {articles: articles})
})


// Database Setup
mongoose.connect("mongodb://localhost/blog")
const db = mongoose.connection
db.on("error", (error) => {
    console.error(error)
})

db.once("open", () => {
    console.log("Connected to Database successfully")
})

// Port Setup
app.listen(port, (error) => {
    if (error) {
        console.log("App not listening on specified port", error)
    } else {
        console.log("App listening on port " +port)
    }
})
