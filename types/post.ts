export type CreatePostInput = {
    title: string;
    author: string;
    category: string;
}

export type Post = {
    _id: number;
    title: string;
    author: string;
    category: string;
    publishedDate: string;
    likes: number;
    comments: number;
};