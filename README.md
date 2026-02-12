# Community Platform - MERN Stack

A robust, scalable, and user-friendly community platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include user authentication, post creation, commenting, and admin moderation capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Post Management**: Create, read, update, and delete posts (authenticated users only)
- **Comments System**: Any user can comment on posts
- **Admin Moderation**: Special admin replies with visual distinction
- **Like System**: Users can like posts and comments
- **User Profiles**: Customizable user profiles with avatars and bios
- **Role-based Access Control**: Admin and user roles with different permissions

### Technical Features
- RESTful API architecture
- JWT-based authentication
- MongoDB with Mongoose ODM
- Input validation with express-validator
- Security middleware (Helmet, CORS, Rate Limiting)
- Responsive React UI with React Router
- Context API for state management
- Clean, maintainable code structure

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd community-platform
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Configuration
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/community-platform
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community-platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

#### Client Configuration (Optional)
Create a `.env` file in the `client` directory if you want to use a different API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

**Option 1: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service:
  ```bash
  # On macOS with Homebrew
  brew services start mongodb-community
  
  # On Ubuntu
  sudo systemctl start mongod
  
  # On Windows
  net start MongoDB
  ```

**Option 2: MongoDB Atlas (Recommended for deployment)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Seed Initial Data (Optional)

To create demo users (admin and regular user), create a seed script or manually register:

**Admin Account:**
- Email: admin@demo.com
- Password: admin123

**User Account:**
- Email: user@demo.com
- Password: user123

You can create these users by registering through the app and manually updating the `role` field in MongoDB to 'admin' for the admin user.

## 🚀 Running the Application

### Development Mode

**Option 1: Run both servers concurrently (from root directory)**
```bash
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

Build the client:
```bash
cd client
npm run build
```

Start the server:
```bash
cd server
npm start
```

## 📁 Project Structure

```
community-platform/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Configuration files
│   │   └── db.js         # Database connection
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js
│   │   └── validate.js   # Validation middleware
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── validators/       # Input validation rules
│   │   ├── authValidators.js
│   │   ├── postValidators.js
│   │   └── commentValidators.js
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── server.js         # Server entry point
│
├── client/               # Frontend (React)
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── PostCard.js
│   │   │   ├── CommentItem.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/     # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/       # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── CreatePost.js
│   │   │   ├── EditPost.js
│   │   │   ├── PostDetail.js
│   │   │   └── Profile.js
│   │   ├── services/    # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── postService.js
│   │   │   └── commentService.js
│   │   ├── styles/      # CSS files
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main App component
│   │   └── index.js     # React entry point
│   └── package.json
│
├── package.json          # Root package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Posts
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:id` - Get single post (public)
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner/admin)
- `DELETE /api/posts/:id` - Delete post (protected, owner/admin)
- `PUT /api/posts/:id/like` - Like/unlike post (protected)

### Comments
- `GET /api/posts/:postId/comments` - Get comments for a post (public)
- `POST /api/posts/:postId/comments` - Create comment (protected)
- `POST /api/posts/:postId/admin-reply` - Create admin reply (admin only)
- `PUT /api/comments/:id` - Update comment (protected, owner/admin)
- `DELETE /api/comments/:id` - Delete comment (protected, owner/admin)
- `PUT /api/comments/:id/like` - Like/unlike comment (protected)

## 🔐 Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Token is automatically attached to all API requests via axios interceptor
5. Server validates token on protected routes
6. Expired/invalid tokens redirect to login page

## 👥 User Roles

### Regular User
- Create, edit, and delete own posts
- Comment on any post
- Like posts and comments
- Edit own profile

### Admin
- All regular user permissions
- Create special admin replies (visually distinct)
- Edit/delete any post or comment
- Moderate content

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Clean and modern interface
- Toast notifications for user feedback
- Loading states and error handling
- Admin replies highlighted with special styling
- Like/unlike animations
- Pagination for posts

## 🚀 Deployment

### Deploying to Heroku

1. Create a Heroku account and install Heroku CLI

2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
```

5. Deploy:
```bash
git push heroku main
```

### Deploying to Vercel (Frontend) + Render/Railway (Backend)

**Backend (Render/Railway):**
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project to Vercel
3. Set `REACT_APP_API_URL` environment variable
4. Deploy

### Environment Variables for Production

Backend:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
CLIENT_URL=your_frontend_url
PORT=5000
```

Frontend:
```
REACT_APP_API_URL=your_backend_api_url
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Create post (authenticated)
- [ ] Edit own post
- [ ] Delete own post
- [ ] View all posts
- [ ] View single post with comments
- [ ] Add comment to post
- [ ] Admin can create admin reply
- [ ] Edit own comment
- [ ] Delete own comment
- [ ] Like/unlike posts
- [ ] Like/unlike comments
- [ ] Update user profile
- [ ] Logout functionality
- [ ] Protected routes redirect to login
- [ ] Admin-only routes restricted

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check MONGODB_URI in .env
- Ensure network access is allowed (for Atlas)

**CORS Errors:**
- Verify CLIENT_URL in server .env
- Check REACT_APP_API_URL in client .env

**Authentication Issues:**
- Clear localStorage
- Check JWT_SECRET matches between requests
- Verify token hasn't expired

**Port Already in Use:**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

## 📝 Code Quality

- ESLint configuration for consistent code style
- Clean code principles
- Modular architecture
- Comprehensive error handling
- Input validation on all routes
- Security best practices

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP security headers with Helmet
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Protection against NoSQL injection

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Community Platform Development Team

## 🙏 Acknowledgments

- MongoDB for the excellent database
- Express.js for the robust backend framework
- React for the powerful frontend library
- Node.js for the runtime environment
