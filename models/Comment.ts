import mongoose, { Schema, model, models, Document } from "mongoose";

interface CommentDocument extends Document {
  postId: string;
  userId: string;
  imageUrl?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    postId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  models.Comment || model<CommentDocument>("Comment", CommentSchema);

export default Comment;