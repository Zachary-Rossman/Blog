import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: false,
    },

    authorId: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    publishedDate: {
        type: Date,
        default: Date.now,
    },

    likes: {
        type: Number,
        default: 0,
    },

    comments: {
        type: Number,
        default: 0,
    },
});

const Post = 
    mongoose.models.Post ||
    mongoose.model("Post", PostSchema);

export default Post;