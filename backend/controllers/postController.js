const Post = require('../models/post')
const Reply = require('../models/reply')
const Like = require('../models/like')
const {getConnectionsIds} = require('../helpers')
const {ObjectId} = require('mongodb')

async function createPost(req, res) {
  const {title} = req.body

  if (!title) return res.sendStatus(400)

  await Post.create({title, user: req.user._id})

  res.json({
    success: {
      message: 'Post created successfully'
    }
  })
}

async function likePost(req, res) {
  const {postId, type} = req.body

  if (!type || !postId) return res.sendStatus(400)

  const post = await Post.findById(postId)
  const liked = await Like.findOne({post: postId, user: req.user._id})

  let like

  // he liked or disliked the post already
  // so we remove it
  if (liked) {
    await liked.deleteOne()
    post.likes.pull(liked._id)
    await post.save()

    if (liked.type !== type) {
      like = await Like.create({
        user: req.user._id,
        post: postId,
        type
      })

      post.likes.push(like._id)
      post.save()
    }
  } else {
    like = await Like.create({
      user: req.user._id,
      post: postId,
      type
    })

    post.likes.push(like._id)
    post.save()
  }

  res.json({
    success: {
      message: 'Successful',
      type: like?.type
    }
  })
}

async function removePost(req, res) {
  const {postId} = req.body

  const post = await Post.findById(postId)

  if (!post || post.user != req.user._id) {
    res.json({
      error: 'an error occurred'
    })
    return
  }

  await Post.findByIdAndRemove(postId)

  res.json({
    success: 'Successfully deleted the post'
  })
}

async function getPosts(req, res) {
  const connectionIds = await getConnectionsIds(req)

  const posts = await Post.aggregate([
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'post',
        pipeline: [{$match: {type: 'like'}}],
        as: 'likeCount'
      }
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'post',
        pipeline: [{$match: {type: 'dislike'}}],
        as: 'dislikeCount'
      }
    },
    {
      $addFields: {
        likeCount: {$size: '$likeCount'},
        dislikeCount: {$size: '$dislikeCount'}
      }
    },
    {$sort: {_id: -1}},
    {$match: {user: {$in: [...connectionIds, new ObjectId(req.user._id)]}}}
  ])

  const paths = [
    {path: 'user'}
  ]

  if (req.user) {
    paths.push({
      path: 'likes',
      match: {user: req.user._id}
    })
  }

  await Post.populate(posts, [...paths])

  res.json(posts.map(post => ({...post, userLike: post?.likes[0]})))
}

async function createReply(req, res) {
  const {postId, title} = req.body

  if (!title || !postId) return res.sendStatus(400)

  const post = await Post.findById(postId)
  const reply = await Reply.create({title, post: postId, user: req.user._id})

  post.replies.push(reply)
  post.save()

  res.json({
    success: {
      message: 'Reply created successfully'
    }
  })
}

async function removeReply(req, res) {
  const {replyId} = req.body

  const reply = await Reply.findById(replyId)

  if (!reply || reply.user != req.user._id) {
    res.json({
      error: 'an error occurred'
    })
    return
  }

  const post = await Post.findById(reply.post)

  post.replies.pull(reply)

  await post.save()
  await Reply.findByIdAndRemove(replyId)

  res.json({
    success: 'Successfully deleted reply'
  })
}

async function getReplies(req, res) {
  const {postId} = req.query

  const replies = await Reply.find({post: postId}).sort({_id: -1}).populate('user')

  res.json(replies)
}

module.exports = {
  createPost,
  removePost,
  getPosts,
  likePost,
  createReply,
  removeReply,
  getReplies
}
