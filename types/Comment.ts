export type CreateCommentInput = {
    imageUrl?: string;
    content: string;
}

export type Comment = {
    _id: string;
    postId: string;
    userId: string;
    imageUrl?: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};