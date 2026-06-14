# Blog

Current Version: Pre-Alpha

This project is a full-stack blog application that allows users to create accounts, manage their profiles, publish posts, edit existing content, delete their own posts, interact with other users through comments and likes, and save favorite posts for later viewing.

---

## Overview

This is a full-stack blog application built with Next.js. This project's goal is to learn how to build a full stack application using modern web development concepts like React, Next.js, server-side rendering, routing, authentication, database integration, and content management while building a production-style application from scratch. 

## Goals

The primary goals of this project are:

* Learn the Next.js App Router architecture
* Practice React component design
* Implement authentication and authorization
* Build CRUD functionality
* Work with databases and APIs
* Deploy a production-ready application
* Follow industry-standard project structure and development practices

---

## Planned Features

### Public Features

* View blog posts
* Read blog posts
* Like blog posts
* Comment on blog posts
* Favorite blog posts
* User profiles
* Responsive design
* Search functionality
* Category filtering
* Pagination

### Author Features

* Create posts
* Edit posts
* Delete posts
* Upload featured images
* Draft and publish workflow

### Administrative Features

* User management
* Role-based permissions
* Content moderation
* Site analytics dashboard

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* CSS Modules / Tailwind CSS / Custom CSS

### Backend

* Next.js Server Actions
* Route Handlers
* Node.js

### Database

* MongoDB
* Mongoose

### Authentication

Planned (NextAuth/Auth.js or custom authentication solution)

### Deployment

Planned (Vercel)

---

## Project Structure

```
project-root/
 
├── app/
    ├── dashboard/
        └── page.tsx 
    ├── login/
        └── page.tsx 
    ├── posts/
        └── page.tsx 
    ├── register/
        └── page.tsx 
    ├── page.tsx
    ├── layout.tsx
    └── globals.css
 
├── components/
    ├── layout/
        └── Hero.tsx
    ├── navigation/
        └── Navbar.tsx
    ├── posts
        └── PostCard.tsx
    └── ui/
        └── Button.tsx

├── app/
    └── posts.ts
 
├── lib/
 
├── public/
 
├── node_modules/
 
├── README.md
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## Development Roadmap

### Phase 1

* [x] Project setup
* [x] Repository initialization
* [x] README creation
* [x] Basic routing

### Phase 2

* [ ] Navigation system
* [ ] Layout structure
* [ ] Blog post pages
* [ ] Styling implementation

### Phase 3

* [ ] Database integration
* [ ] Post storage
* [ ] Dynamic routes

### Phase 4

* [ ] Authentication
* [ ] User accounts
* [ ] Protected routes

### Phase 5

* [ ] Content management system
* [ ] Post editor
* [ ] Image uploads

### Phase 6

* [ ] Production deployment
* [ ] Performance optimization
* [ ] Final testing

---

## Resources

- Next.js Documentation
- React Documentation
- TypeScript Documentation
- MongoDB Documentation
- Mongoose Documentation
- MDN JavaScript Documentation

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Zachary-Rossman/Blog.git
```

Navigate into the project:

```bash
cd Blog
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Learning Objectives

This project is being developed as part of an ongoing effort to strengthen skills in:

* React
* Next.js
* TypeScript
* Full-stack application development
* API design
* Authentication
* Database design
* Deployment workflows

---

## Current Status

🚧 In Active Development

This project is currently under development and features may change as the application evolves.

---

## Future Enhancements

Potential future improvements include:

* Rich text editor
* Newsletter integration
* SEO optimization
* Social sharing
* Content recommendations

---

## License

MIT License

---

## Author

Name: Zachary Rossman

GitHub Username: Zachary-Rossman
GitHub URL: https://github.com/Zachary-Rossman
