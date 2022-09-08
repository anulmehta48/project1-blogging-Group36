const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModels");

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
    req.loggedInAuthor = decodedToken.userId;
    next();
  } catch (err) {
    res.status(500).send({ msg: "server error", error: err });
  }
};

const authorise = async function (req, res, next) {
  try {
      let requestBlogId = req.params.blogsId
      let BlogData=await blogModel.findById(requestBlogId)
      let blogAuthor=BlogData.authorId.toString()
      if (blogAuthor != req.loggedInAuthor) {
         return res.status(403).send({ status: false, msg: " this User not valid" })
      }
      next()
  } catch (err) {
      return res.status(500).send({ msg: "server error", error: err });
  }

};
 
const authorize = async function(req,res,next){
  try {
    const query = req.query;
    if (Object.keys(query).length==0){
        return res.status(401).send({status:false, msg:"query is mandatory"})
      }
      const a= await blogModel.find(query)
      if (a.length==0){
       return res.status(404).send({status : false, msg: "data not found"})
      }
    next()
} catch (err) {
    return res.status(500).send({ msg: "server error", error: err });
}

}

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.authorize = authorize;
