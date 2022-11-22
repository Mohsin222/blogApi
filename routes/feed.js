const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is_auth')

router.get('/posts',isAuth,feedController.getAllPosts),

//for using url images
router.post('/webimages',isAuth,feedController.webPost)
router.get('/webimages',isAuth,feedController.getAllPosts)
//update imageUrlPost
router.put('/udateUrlPost/:postId',isAuth,feedController.updateUrlPost)

router.post('/post',
isAuth,

[
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ]

,feedController.createPost)

//update post

router.put('/post/:postId',[
  body('title')
  .trim()
  .isLength({ min: 5 }),
body('content')
  .trim()
  .isLength({ min: 5 })
],feedController.updatePost)


//delete post
router.delete('/post/:postId',isAuth,  feedController.deletePost);



router.get('/:userpost',feedController.getCurrentUserPost)


//comment on post
router.put('/comment/:postId',feedController.commnetOnPost)

module.exports = router;