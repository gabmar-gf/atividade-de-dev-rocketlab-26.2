import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { MovieFormPage } from './pages/MovieFormPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AddedMoviesPage } from './pages/AddedMoviesPage';
import { RatingsPage } from './pages/RatingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/movies" replace />}
          />

          <Route
            path="/movies"
            element={<CatalogPage />}
          />

          <Route
            path="/movies/new"
            element={<MovieFormPage />}
          />

          <Route
            path="/movies/added"
            element={<AddedMoviesPage />}
          />

          <Route
            path="/movies/:id"
            element={<MovieDetailPage />}
          />

          <Route
            path="/watchlist"
            element={<WatchlistPage />}
          />

          <Route
            path="/ratings"
            element={<RatingsPage />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;