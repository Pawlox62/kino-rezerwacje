import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieShows from "./pages/MovieShows";
import Booking from "./pages/Booking";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import AdminMovies from "./pages/AdminMovies";
import AdminMoviesList from "./pages/AdminMoviesList";
import AdminHallsList from './pages/AdminHallsList'
import AdminHalls     from './pages/AdminHalls'
import AdminShows from "./pages/AdminShows";
import AdminShowsList from "./pages/AdminShowsList";

function RequireAuth({ children, admin }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (admin && role !== "admin") return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Movies />
              </RequireAuth>
            }
          />
          <Route
            path="/movie/:movieId/shows"
            element={
              <RequireAuth>
                <MovieShows />
              </RequireAuth>
            }
          />
          <Route
            path="/booking/:showId"
            element={
              <RequireAuth>
                <Booking />
              </RequireAuth>
            }
          />
          <Route
            path="/user"
            element={
              <RequireAuth>
                <UserPanel />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/panel"
            element={
              <RequireAuth admin>
                <AdminPanel />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/movies"
            element={
              <RequireAuth admin>
                <AdminMoviesList />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/movies/new"
            element={
              <RequireAuth admin>
                <AdminMovies />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/movies/edit/:movieId"
            element={
              <RequireAuth admin>
                <AdminMovies />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/halls"
            element={
              <RequireAuth admin>
                <AdminHallsList />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/halls/new"
            element={
              <RequireAuth admin>
                <AdminHalls />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/halls/edit/:hallId"
            element={
              <RequireAuth admin>
                <AdminHalls />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/shows"
            element={
              <RequireAuth admin>
                <AdminShowsList />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/shows/new"
            element={
              <RequireAuth admin>
                <AdminShows />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/shows/edit/:showId"
            element={
              <RequireAuth admin>
                <AdminShows />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
