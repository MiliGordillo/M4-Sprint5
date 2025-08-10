import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SongsList from "../pages/SongList";
import SongDetail from "../pages/SongDetail";
import SongCreate from "../pages/SongCreate";
import SongEdit from "../pages/SongEdit";
import NotFound from "../pages/NotFound";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/songs" element={<SongsList />} />
    <Route path="/songs/create" element={<SongCreate />} />
    <Route path="/songs/:id" element={<SongDetail />} />
    <Route path="/songs/:id/edit" element={<SongEdit />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

export default AppRouter;
