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
      toast.error("Error when fetching songs");
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
      toast.error("Error when fetching songs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // El toast de error solo se muestra si showErrorToast es true (por defecto false)
  const getSong = async (id, showErrorToast = false) => {
    try {
      const res = await api.get(`/songs/${id}`);
      return res.data;
    } catch (err) {
      if (showErrorToast) toast.error("The song could not be obtained");
      throw err;
    }
  };

  const createSong = async (payload) => {
    try {
      const res = await api.post("/songs", payload);
      setSongs(prev => [...prev, res.data]);
      toast.success("Song created successfully");
      return res.data;
    } catch (err) {
      toast.error("Error creating song");
      throw err;
    }
  };

  const updateSong = async (id, payload) => {
    try {
      const res = await api.put(`/songs/${id}`, payload);
      setSongs(prev => prev.map(s => (s.id === id ? res.data : s)));
      toast.success("Song updated successfully");
      return res.data;
    } catch (err) {
      toast.error("Error updating song");
      throw err;
    }
  };

  const deleteSong = async (id) => {
    try {
      await api.delete(`/songs/${id}`);
      setSongs(prev => prev.filter(s => s.id !== id));
      toast.success("Song deleted successfully");
    } catch (err) {
      toast.error("Error deleting song");
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
