import React, { useContext, useState } from "react";
import { SongContext } from "../context/SongContext";
import SongForm from "../components/SongForm";
import { useNavigate } from "react-router-dom";

function SongCreate() {
  const { createSong } = useContext(SongContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      const created = await createSong(payload);
      if (created && created.id) {
        navigate(`/songs/${created.id}`);
      } else {
        window.toast && window.toast.error("Failed to redirect, please try again.");
      }
    } catch (err) {
      window.toast && window.toast.error("Error creating song");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent">
        Add song
      </h2>
      <SongForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

export default SongCreate;
