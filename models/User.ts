import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    birthday: {
        type: Date,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    publishedDate: {
        type: Date,
        default: Date.now,
    },
});

const User = 
    mongoose.models.User ||
    mongoose.model("User", UserSchema);

export default User;