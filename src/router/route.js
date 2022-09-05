const express = require('express');
const router = express.Router();

const mid=require('../middleware/authorMiddleware')
const authorController= require("../controllers/authorController")

router.get("/test-me", (req, res)=> {
    res.send("My first ever api!")
})

router.post("/Authors",mid.AuthorMW, authorController.createAuthor  )


module.exports = router;