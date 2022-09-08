const jwt = require("jsonwebtoken");
const blogModels = require("../models/blogModels");

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(404)
        .send({ status: false, msg: "token must be present" });
    }
   
    let decodedToken = jwt.verify(token, "functionup-plutonium");
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" });
    }
    req.loggedInAuthor = decodedToken.authorId;
    next();
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err });
  }
};

const authorise = async function (req, res, next) {
  try {
    let requestBlogId = req.params.blogsId
    // let reqQuery=req.query
    // let findBlog= blogModels.find(reqQuery)
    
    let blog=await blogModels.findById({_id:requestBlogId})
    if (blog._Id !== req.loggedInAuthor) {
        return res.status(403).send({ status: false, msg: "Permission Denied for this User" })
    }//else if(reqQuery.authorId !== req.loggedInAuthor || reqQuery !==findBlog ){
  //   return res.status(404).send( {status:false, msg:"data not present in the database"} )
  // }
    next()
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
