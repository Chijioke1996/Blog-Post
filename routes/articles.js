const { render } = require("ejs")
const express = require("express")
const router = express.Router()
const articleDatabase = require("../models/articles")
const methodOverride = require("method-override")

router.use(methodOverride("_method"))
router.use(express.urlencoded( {extended: false}))

router.get("/new", (req, res) => {

    res.render("articles/new", {article: new articleDatabase() })
})


// If successfully saved to database it redirects here using ID:
router.get("/:slug", async (req, res) => {
    let article = await articleDatabase.findOne({slug:req.params.slug})
   if (article == null) {
     res.redirect("/")
   }
   else {
    res.render("articles/show", {article: article})
   }

 
    
})

router.post("/", async (req, res) => {
    let article = new articleDatabase({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })

    try {
        article = await article.save()
        res.redirect(`/article/${article.slug}`)
    } catch (error) {
        //On failure repopulate the form fields with recently typed data from "let article"
        res.render("articles/new", { article: article})
    }
    
})

// DELETE 
router.delete("/:id", async (req, res) =>{
    await articleDatabase.findByIdAndDelete(req.params.id)
    res.redirect("/")
})

module.exports = router