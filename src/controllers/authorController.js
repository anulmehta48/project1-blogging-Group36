const authorModel=require('../Models/authorModels');

const createAuthor= async function (req, res) {
    let author = req.body
    let authorCreated = await authorModel.create(author)
    res.status(200).send({data: authorCreated})
}


module.exports.createAuthor= createAuthor
