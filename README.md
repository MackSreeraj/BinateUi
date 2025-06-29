# Binate UI - User Management System

A modern user management system built with Next.js, MongoDB, and Tailwind CSS.

## Features

- Create users with profile pictures
- View all users in a responsive grid
- Image upload and storage
- Real-time data updates
- Responsive design

## Prerequisites

- Node.js 16.14.0 or later
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/binate-ui.git
   cd binate-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   # or
   yarn db:setup
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
binate-ui/
├── app/                    # App router
│   ├── api/                # API routes
│   └── components/         # Shared components
├── lib/                    # Utility functions
├── public/                 # Static files
│   └── uploads/            # User uploaded files
├── scripts/                # Database scripts
└── styles/                 # Global styles
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Set up the database indexes

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - URL of your application (for authentication callbacks)
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js (generate with `openssl rand -base64 32`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
