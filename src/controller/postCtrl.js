const { default: mongoose } = require("mongoose")
const Post = require("../models/postModel")
const User = require("../models/userModel")



const postCtrl = {
    // creating a post 
    createPost: async(req, res) => {
        try {
            const newPost = new Post(req.body)
            await newPost.save()

            res.status(201).json(newPost)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    getPost: async(req, res) => {
        const {id} = req.params
        try {
            const post = await Post.findById(id)
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // update post 
    updatePost: async(req, res) => {
        const postId = req.params.id
        const {userId} = req.body
        try {
            const post = await Post.findById(postId)
            if(post.userId === userId){
                await post.updateOne({$set: req.body})
                res.status(200).json("Post updated!")
            }else{
                res.status(403).json("Authention failed!")
            }

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    deletePost: async(req, res) => {
        const postId = req.params.id
        const {userId} = req.body
        try {
            if(Post.userId === userId){
                await Post.findByIdAndDelete(postId)
                res.status(200).json("Post delete!")
            }else{
                res.status(403).json("Authtication failed!")
            }

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // like / dislike a post
    likePost: async(req, res) => {
        const postId = req.params.idn
        const {userId} = req.body
        try {
            const post = await Post.findById(postId)
            if(post.likes.includes(userId)){
                await post.updateOne({$pull: {likes: userId} } )
                res.status(200).json("Post disliked")
            }else{
                await post.updateOne({$push: {likes: userId} } )
                res.status(200).json("Post like")
            }
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // get timeline posts
    // gettimelinePosts: async(req, res) => {
    //     const userId = req.params.id
    //     try {
    //         const currentUserPosts = await Post.find({userId})
    //         const followingPosts = await User.aggregate([
    //             {
    //                 $match: {
    //                     _id: new mongoose.Types.ObjectId(userId),
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: "posts",
    //                     localField: "following",
    //                     foreignField: "userId",
    //                     as: "followingPosts",
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     followingPosts: 1,
    //                     _id: 0,
    //                 }
    //             }

    //         ])
    //         res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a, b) => {
    //             return new Date(b.createAt) - new Date(a.createAt)
    //         }))
    //     } catch (error) {
    //         res.status(500).json({message: error.message})
    //     }
    // }

    gettimelinePosts: async (req, res) => {
        const userId = req.params.id
        try {
          const currentUserPosts = await Post.find({userId})
    
          const followingPosts = await User.aggregate([
            
            {
              $match: {
              _id: new mongoose.Types.ObjectId(userId),
              }
            },
            {
              $lookup: {
                from: "posts",
                localField: "following",
                foreignField: "userId",
                as: "followingPosts",
              }
            },
            {
              $project: {
                followingPosts: 1,
                _id: 0,
              }
            }
            
          ])
    
          res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((b, a) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
          }))
        } catch (error) {
          res.status(500).json({message: error.message})
        }
      }
}

module.exports = postCtrl