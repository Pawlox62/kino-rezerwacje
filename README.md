# Kino Rezerwacje

A full stack web application for cinema seat reservation. It consists of a Node.js/Express backend and a React (Vite) frontend.

## Features

- **User authentication** using JSON Web Tokens
- **Real-time** seat locking with Socket.IO so multiple users cannot reserve the same seat simultaneously
- **Admin panel** for managing movies, halls, and shows as well as viewing occupancy statistics
- **MongoDB** database models for users, movies, halls, shows and bookings

## Project structure

```
/ - root of the repository
  /client   React application (Vite)
  /server   Express REST API with Socket.IO
```

## Running the application

1. Install dependencies in both subdirectories:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Copy `server/.env` and adjust the variables to match your environment. An example:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/kino
   JWT_SECRET=yourSecret
   ```
3. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
4. Start the frontend in another terminal:
   ```bash
   cd client
   npm run dev
   ```
   The frontend expects the API at `http://localhost:4000/api` as configured in `client/src/api/axios.js`.

## Usage

- Register and log in to book seats.
- Select a movie and a showtime. While choosing seats, the backend locks them in real time for all connected clients.
- Confirm the reservation to store it in the database and view it later under **Moje rezerwacje**.
- Administrators can manage content and view statistics after logging in with an admin account.

## License

No license file is provided in this repository.

