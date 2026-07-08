export type CreateUserInput = {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    username: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
}

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    username: string;
    password: string;
    publishedDate: string;
};