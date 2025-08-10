import React, { useState, useEffect } from "react";
import SongContext from "./SongContextContext";
import api from "../service/api";
import { toast } from "react-toastify";

const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = async (query) => {
    setLoading(true);
    try {
      const res = await api.get(`/songs?search=${query}`);
      setSongs(res.data);
    } catch (err) {
      toast.error("Error al buscar canciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/songs");
      setSongs(res.data);
    } catch (err) {
      toast.error("Error al cargar canciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSong = async (id) => {
    try {
      const res = await api.get(`/songs/${id}`);
      return res.data;
    } catch (err) {
      toast.error("No se pudo obtener la canción.");
      throw err;
    }
  };

  const createSong = async (payload) => {
    try {
      const res = await api.post("/songs", payload);
      setSongs(prev => [...prev, res.data]);
      toast.success("Canción creada");
      return res.data;
    } catch (err) {
      toast.error("Error creando canción");
      throw err;
    }
  };

  const updateSong = async (id, payload) => {
    try {
      const res = await api.put(`/songs/${id}`, payload);
      setSongs(prev => prev.map(s => (s.id === id ? res.data : s)));
      toast.success("Canción actualizada");
      return res.data;
    } catch (err) {
      toast.error("Error actualizando canción");
      throw err;
    }
  };

  const deleteSong = async (id) => {
    try {
      await api.delete(`/songs/${id}`);
      setSongs(prev => prev.filter(s => s.id !== id));
      toast.success("Canción eliminada");
    } catch (err) {
      toast.error("Error eliminando canción");
      throw err;
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <SongContext.Provider value={{
      songs,
      loading,
      fetchSongs,
      getSong,
      createSong,
      updateSong,
      deleteSong,
      searchSongs
    }}>
      {children}
    </SongContext.Provider>
  );
};

export default SongProvider;
