const Post= require('../models/post')
const User= require('../models/user')
const fs =require('fs')
const { validationResult } = require('express-validator');
const path= require('path');

//normal Post
exports.createPost= (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error =  Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
      }
      
      const file = req.file;
      const fileName = req.file.fileName;
  const basePath = `${req.protocol}://${req.get("host")}`;
  

      const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = Post({
title:title,
content:content,
imageUrl:`${basePath}/${imageUrl}`,
//creator: { name: 'Mohsin Irfan' }
creator:req.userId
    })

    post.save()
    .then(result => {
     return User.findById(req.userpost)
      })
      .then(user =>{
        creator =user;
        user.posts.push(post)

        return user.save()
     
      })
      .then( result=>{
        res.status(201).json({
          message: 'Post created successfully!',
          post: post,
          creator:{_id:creator._id,name:creator.name}
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
res.json({post})
    console.log(post)
}
//for web url images
exports.webPost=(req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error =  Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.body.imageUrl;
  const title = req.body.title;
  const content = req.body.content;
  const email =req.body.email
  //const creator =req.body.creator
  let creator;
  const post = Post({
    title:title,
    content:content,
    imageUrl:imageUrl,
    //creator: { name: 'Mohsin Irfan' }
    creator:req.userId,
    email:email

        })
   post.save()
        .then(result => {

          return User.findById(req.userId)
  
          })
          .then(user =>{
        //    console.log('aaaaaaaaaaaaaaaaaaaaaaa'+user)
            creator =user;
            user.posts.push(post)
    
          return user.save()
          })
          .then( result=>{
            res.status(201).json({
              message: 'Post created successfully!',
              post: post,
              creator:{_id:creator._id,name:creator.name}
            });
          })
          .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
          res.json({post})
    console.log(post)
}
//url post update

exports.urlUpdatePost = (req, res, next) => {
  const postId = req.params.postId;


  const basePath = `${req.protocol}://${req.get("host")}`;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  // if (req.file) {
  //   imageUrl = req.file.path;
  // }
  // if (!imageUrl) {
  //   const error = new Error('No file picked.');
  //   error.statusCode = 422;
  //   throw error;
  // }

  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    //user only delete its own posts
    if(post.creator.toString() !== req.userId){
    const error =new Error('Not Authorized')
    error.statusCode= 403
    throw error
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl =imageUrl;
    post.content = content;
    return post.save();
  })
  .then(result => {
    res.status(200).json({ message: 'Post updated!', post: result });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

//update url post
exports.updateUrlPost =async (req, res, next) => {
  const postId = req.params.postId;


 
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  const p =await Post.findById(postId)



  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    //user only delete its own posts
    if(post.creator.toString() !== req.userId){
    const error =new Error('Not Authorized')
    error.statusCode= 403
    throw error
    }

    if(title !==''){
      post.title = title;
      //post.title=post.title
    }
    
    if(content !==''){
      post.content = content;
    }
    if(imageUrl !==''){
      post.imageUrl =imageUrl;
    }


 



 
 
  return post.save();
  })
  .then(result => {

res.status(200).json({ message: 'Post updated!', post: result });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}


exports.getAllPosts=async(req,res,next)=>{
  const currentPage =req.query.page || 1
  const perPage =100
  let totalItems
try {
  totalItems=await Post.find()
  .countDocuments()


const posts=await Post.find()
    .skip((currentPage -1) * perPage)
    .limit(perPage)

    res
    .status(200)
    .json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems:totalItems
   
    });
} catch (err) {
  if(!err.statusCode){
    err.statusCode=500
  }
  next(err)
}
  


}


exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;


  const basePath = `${req.protocol}://${req.get("host")}`;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
  .then(post => {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    //user only delete its own posts
    if(post.creator.toString() !== req.userId){
    const error =new Error('Not Authorized')
    error.statusCode= 403
    throw error
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl =`${basePath}/${imageUrl}`;
    post.content = content;
    return post.save();
  })
  .then(result => {
    res.status(200).json({ message: 'Post updated!', post: result });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}



//delete post
exports.deletePost =async(req,res,next)=>{
  const postId =await req.params.postId;


try {
  const post =await Post.findByIdAndDelete(postId);

  if (!post) {

    res.send({error:'Could not find post.'})
   

  }
  else{
     //user only delete its own posts
   if(post.creator.toString() !== req.userId){

    const error =new Error('Not Authorizedaa')
    error.statusCode= 403
    throw error
    }

      var post_id =    Post.findByIdAndRemove(postId)
const user =await User.findById(req.userId)
      console.log(req.userId)

      function arrayRemove(arr, value) {
 
        return arr.filter(function(geeks){
            return geeks != value;
        });
   
     }
     arrayRemove(user.posts, post_id);

    
  //    user.posts.filter(fruit => fruit !== post_id);
//user.posts.pop(post_id)
//await User.save()

  res.status(200).json({ message: 'Deleted post.' });
  //clearImage(post.imageUrl);
   

  }
  
} catch (error) {
  console.log(error)
  res.status(500).send(error)
}



}

//current user posts
exports.getCurrentUserPost= async(req,res,next)=>{
  const user =req.params.userpost;
  const post=await Post.find({creator:req.params.userpost})

  if(!post){
    res.status(500).send('No Post')
  }
  res.send(post)
}

exports.commnetOnPost =async(req,res,next)=>{
  var lst=[];

  const p =await Post.findById({_id:req.params.postId})
  p.comments.map(v =>{
    lst.push(v)
  })

  lst.push(req.body.comments)
//  console.log(lst)

try {
  const post =await Post.findByIdAndUpdate({_id:req.params.postId},{


    comments:lst
  },
  {
    new:true,
    upsert: true 
  })
  res.status(200).send(post)
} catch (error) {
  console.log(error)
}
}


const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
