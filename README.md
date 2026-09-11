# Memory App - Full Stack React & Node.js

A full-stack memory/notes application with user authentication. Users can sign up, log in, and create, edit, and delete their personal memories.

## Project Structure

```
ReactProject/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend
└── README.md
```

## Features

✅ **User Authentication**
- Sign up with email, password, and name
- Secure login with JWT tokens
- Token-based authentication
- Session persistence with localStorage

✅ **Memory Management**
- Create new memories with title and content
- Edit existing memories
- Delete memories
- View all memories in a responsive grid
- Display creation dates

✅ **Modern UI**
- Clean, responsive design
- Beautiful gradient background
- Modal dialogs for adding/editing memories
- Sidebar with user info
- Mobile-friendly layout

## Tech Stack

### Frontend
- React 19
- Vite (build tool)
- Fetch API for backend communication

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
- In-memory database (Map storage)

## Installation & Setup

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start the Servers

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
The app will be available on `http://localhost:3000`

## Usage Guide

### Sign Up
1. Open the app at `http://localhost:3000`
2. Click "Sign Up"
3. Enter your name, email, and password
4. Click "Sign Up" button
5. You'll be automatically logged in

### Login
1. If logged out, you'll see the login form
2. Enter your email and password
3. Click "Login"

### Create a Memory
1. Click the "+ Add Memory" button in the top right
2. Enter a title and content
3. Click "Save"

### Edit a Memory
1. Click the "Edit" button on any memory card
2. Modify the title and content
3. Click "Update"

### Delete a Memory
1. Click the "Delete" button on any memory card
2. Confirm deletion when prompted

### Logout
1. Click the "Logout" button in the sidebar

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Log in with credentials

### Memories
- `GET /api/memories` - Get all memories for logged-in user
- `POST /api/memories` - Create a new memory
- `PUT /api/memories/:id` - Update a memory
- `DELETE /api/memories/:id` - Delete a memory

All memory endpoints require JWT token in `Authorization` header:
```
Authorization: Bearer <token>
```

## Data Structure

### User Object
```json
{
  "id": "1234567890",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Memory Object
```json
{
  "id": "memory123",
  "title": "My First Memory",
  "content": "This is the content of my memory...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## Notes

- **Data Storage**: The backend uses in-memory storage. Data will be lost when the server restarts.
- **Authentication**: Passwords are hashed with bcryptjs before storage.
- **JWT Token**: Tokens expire after 7 days.
- **CORS**: The frontend is allowed to communicate with the backend.

## Future Enhancements

- Add database persistence (MongoDB, PostgreSQL)
- Search functionality for memories
- Tags/categories for memories
- Share memories with other users
- Memory export to PDF
- Rich text editor for memory content
- Image attachments for memories
- Dark mode toggle

## Development

To modify the app:

1. **Frontend changes**: Edit files in `client/src/`
2. **Backend changes**: Edit `server/server.js` or create new route files
3. **Styling**: Modify `client/src/index.css`

Both dev servers support hot reload - changes will be reflected automatically.
