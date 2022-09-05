const controllers=require('../controllers/authorController');

const AuthorMW = (req, res, next) => {
let fname=req.body.fname
let lname=req.body.lname 
let title=req.body.title
let email=req.body.email
let pw=req.body.password
  if (!fname){
    res.status(401).send({ msg: "The request is missing a mandatory First Name !" })
  }
  else if (!lname){
    res.status(401).send({ msg: "The request is missing a mandatory Last Name !" })
  }
  else if (!title){
    res.status(401).send({ msg: "The request is missing a mandatory Title !" })
  }
  else if (!email){
    res.status(401).send({ msg: "The request is missing a mandatory emai !l" })
  }  else if(!pw) {
    res.status(401).send({ msg: "The request is missing a mandatory Password" })
    
  }else{
    next()
  }

};

module.exports.AuthorMW=AuthorMW