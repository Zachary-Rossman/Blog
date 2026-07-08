export type CreatePostInput = {
    title: string;
    body: string;
    imageUrl?: string;
    category: string;
}

export type Post = {
    _id: string;
    title: string;
    body: string;
    imageUrl?: string;
    authorId: string;
    category: string;
    publishedDate: string;
    likes: number;
    comments: number;
};