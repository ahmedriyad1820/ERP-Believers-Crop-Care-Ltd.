# MongoDB Setup Guide

## Connection String

The MongoDB connection string has been configured in the server. The connection string is:

```
mongodb+srv://ahmedriyad1820_db_user:bcc%401892514@bcc.exim7hi.mongodb.net/bcc-erp?retryWrites=true&w=majority
```

**Note:** The `@` symbol in the password has been URL-encoded as `%40`.

## Environment Variables (Optional)

If you want to use environment variables instead of the hardcoded connection string, create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://ahmedriyad1820_db_user:bcc%401892514@bcc.exim7hi.mongodb.net/bcc-erp?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

## Starting the Server

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server
```

Or for development with auto-reload:
```bash
npm run server:dev
```

3. The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Contact Messages
- `POST /api/contacts` - Submit a new contact message
- `GET /api/contacts` - Get all contact messages (admin)
- `GET /api/contacts/:id` - Get a single contact message
- `PATCH /api/contacts/:id/status` - Update contact status
- `DELETE /api/contacts/:id` - Delete a contact message

## Testing the Connection

You can test the MongoDB connection by:

1. Starting the server: `npm run server`
2. Visit `http://localhost:5000/api/health` in your browser
3. You should see a response indicating the database connection status

## Database Collections

The following collections will be created automatically when you use the API:

- `contacts` - Stores contact form submissions

