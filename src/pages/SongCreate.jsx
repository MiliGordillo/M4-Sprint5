import React, { useContext, useState } from "react";
import SongContext from "../context/SongContextContext";
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
        window.toast && window.toast.error("No se pudo redirigir, intente nuevamente.");
      }
    } catch (err) {
      window.toast && window.toast.error("Error al crear la canción");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent">
        Agregar canción
      </h2>
      <SongForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

export default SongCreate;
