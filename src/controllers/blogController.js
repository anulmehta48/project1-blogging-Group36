const blogModel = require("../models/blogModels");
const mongoose = require("mongoose");

//-------------------------------------------------------------------------------------------------------------------//
const createBlog = async (req, res) => {
  try {
    let Blog = req.body;
    if (Object.keys(Blog).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request Please provide valid blog details",
      });
    }

    if (!Blog.title)
      return res.status(400).send({ msg: " title is required " });
    if (!Blog.body) return res.status(400).send({ msg: "body is required " });
    if (!Blog.authorId)
      return res.status(400).send({ msg: " authorId is required " });
    if (!Blog.category)
      return res.status(400).send({ msg: " category is require" });

    let blogCreated = await blogModel.create(Blog);
    res.status(201).send({ status: true, data: blogCreated });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//-------------------------------------------------------------------------------------------------------------------//
const getBlogs = async (req, res) => {
  try {
    let combination = req.query;
    let dataBlog = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }, combination],
    });
    if (dataBlog == 0) {
      return res.status(404).send({ error: " DATA NOT FOUND " });
    } else return res.status(201).send({ data: dataBlog });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//-------------------------------------------------------------------------------------------------------------------//
const updateBlog = async (req, res) => {
  try {
    let inputId = req.params.blogsId;
    let isValid = mongoose.Types.ObjectId.isValid(inputId);
    if (!isValid) return res.status(400).send({ msg: "enter valid objectID" });

    let reqBody = req.body;
    let title = req.body.title;
    let body = req.body.body;
    let tags = req.body.tags;
    let subCategory = req.body.subCategory;

    if (Object.keys(reqBody).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request Please provide valid Author  details",
      });
    }

    let date = Date.now();
    let allDate = date.toString();

    let alert = await blogModel.findOne({ _id: inputId, isDeleted: true });
    if (alert) return res.status(400).send({ msg: "Blog is already deleted" });

    let blogs = await blogModel.findOneAndUpdate(
      { _id: inputId },
      {
        $set: {
          title: title,
          body: body,
          isPublished: true,
          publishedAt: allDate,
        },
        $push: { tags: tags, subCategory: subCategory },
      },
      { new: true }
    );

    if (!blogs) return res.status(404).send({ msg: "no blog found" });
    res.status(200).send({ msg: blogs });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//-------------------------------------------------------------------------------------------------------------------//
const deleteBlog = async (req, res) => {
  try {
    let inputId = req.params.blogsId;

    let isValid = mongoose.Types.ObjectId.isValid(inputId);
    if (!isValid) return res.status(400).send({ msg: "enter valid objestid" });

    let date = Date.now();
    let alltdate = date.toString();

    let deleteAlert = await blogModel.findOne({
      _id: inputId,
      isDeleted: true,
    });
    if (deleteAlert)
      return res.status(409).send({ msg: "This blog is already deleted" });

    let updateData = await blogModel.findOneAndUpdate(
      { _id: inputId },
      { $set: { isDeleted: true, deletedAt: alltdate } },
      { new: true }
    );

    if (!updateData)
      return res.status(404).send({ msg: "This document dose not exist" });

    res.status(200).send({ status: true, msg: updateData });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//-------------------------------------------------------------------------------------------------------------------//
const deleteBlogByCategory = async (req, res) => {
  try {
    const query = req.query;
  if (Object.keys(query).length==0){
      return res.status(401).send({status:false, msg:"query is mandatory"})
    }
    const a= await blogModel.find(query)
    if (a.length==0){
     return res.status(404).send({status : false, msg: "data not found"})
    }
    if (query) {
      const deletedBlogByQuery = await blogModel.updateMany(
        {
          $or: [
            { authorId: query.authorId },
            { category: query.category },
            { tags: query.tags },
            { subcategory: query.subcategory },
            { isPublished: query.isPublished },
          ]
        },
        { $set: { isDeleted: true, deletedAt: Date.now() } }
      );
      if (deletedBlogByQuery.modifiedCount == 0) {
        return res.status(404).send({ status: false, msg: "Alredy deleted" });
      }
      return res
        .status(200)
        .send({ status: true, msg: "Blogs are deleted successfully." });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message });
  }
};
//---------------------------------------------------------------------------------------------------------------//
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByCategory = deleteBlogByCategory;

//----------------------------------------------------------------------------------------------------------------//
