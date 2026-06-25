export type CreatePostInput = {
    title: string;
    category: string;
}

export type Post = {
    _id: string;
    title: string;
    authorId: string;
    category: string;
    publishedDate: string;
    likes: number;
    comments: number;
};