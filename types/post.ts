export type CreatePostInput = {
    title: string;
    body: string;
    category: string;
}

export type Post = {
    _id: string;
    title: string;
    body: string;
    authorId: string;
    category: string;
    publishedDate: string;
    likes: number;
    comments: number;
};