# BCC ERP - Believers Crop Care Ltd.

A responsive React application for Believers Crop Care Ltd. built with Vite and React, with MongoDB backend integration.

## Getting Started

### Installation

```bash
npm install
```

This will install both frontend and backend dependencies including:
- React, Vite (Frontend)
- Express, Mongoose, CORS (Backend)

### Development

#### Frontend Development

```bash
npm run dev
```

The frontend app will be available at `http://localhost:5173`

#### Backend Server

```bash
npm run server
```

The backend API server will be available at `http://localhost:5000`

For development with auto-reload:
```bash
npm run server:dev
```

#### Running Both (Recommended - One Command)

Run frontend + backend together:

```bash
npm run start
```

This will start:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:5000`

Env required:
- Backend `.env` (not committed):  
  ```
  MONGODB_URI=your_mongo_uri
  PORT=5000
  NODE_ENV=development
  ```
- Frontend `.env.local` (not committed):  
  ```
  VITE_API_BASE=http://localhost:5000
  ```

If you prefer separate terminals:
1. Terminal 1: `npm run dev` (Frontend on port 5173)
2. Terminal 2: `npm run server` (Backend on port 5000)

### Mobile Testing

#### Option 1: Browser Dev Tools (Easiest)
1. Start the dev server: `npm run dev`
2. Open Chrome/Edge DevTools (F12)
3. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
4. Select a device preset or set custom dimensions
5. Test different screen sizes

#### Option 2: Test on Real Mobile Device
1. Start the dev server: `npm run dev`
2. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig` or `ip addr` in terminal
   - **Windows**: Run `ipconfig` in command prompt
   - Look for IPv4 address (e.g., `192.168.1.100`)
3. Make sure your mobile device is on the same Wi-Fi network
4. On your mobile device, open browser and go to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`
5. The site should load on your mobile device!

#### Option 3: Build and Preview
```bash
npm run build
npm run preview
```
Then access via network IP as shown in Option 2.

### Build for Production

```bash
npm run build
```

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: Below 480px

## MongoDB Setup

MongoDB has been configured with the connection string. The database connection is set up in `server/config/config.js`.

**Connection String:**
```
mongodb+srv://ahmedriyad1820_db_user:bcc%401892514@bcc.exim7hi.mongodb.net/bcc-erp
```

**Note:** The `@` symbol in the password is URL-encoded as `%40`.

For more details, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### Seeding Database with Existing Data

To populate MongoDB with all your existing data (products, team members, testimonials, blog posts, notices, and career opportunities), run:

```bash
npm run seed
```

This will:
- Clear existing data in the database
- Insert all products (11 items)
- Insert all team members (7 members)
- Insert all testimonials (3 testimonials)
- Insert all blog posts (5 posts)
- Insert sample notices (5 notices)
- Insert all career opportunities (3 positions)

**Note:** The seed script will delete all existing data before inserting new data. Use with caution in production!

## API Endpoints

### Health Check
- `GET http://localhost:5000/api/health` - Check server and database status

### Contact Messages
- `POST http://localhost:5000/api/contacts` - Submit a new contact message
- `GET http://localhost:5000/api/contacts` - Get all contact messages (admin)
- `GET http://localhost:5000/api/contacts/:id` - Get a single contact message
- `PATCH http://localhost:5000/api/contacts/:id/status` - Update contact status
- `DELETE http://localhost:5000/api/contacts/:id` - Delete a contact message

## Features

- Fully responsive design
- Multi-language support (English/Bengali)
- Mobile-optimized navigation
- Touch-friendly interactions
- Smooth scrolling
- Optimized images and assets
- MongoDB database integration
- RESTful API backend
- Contact form backend support
