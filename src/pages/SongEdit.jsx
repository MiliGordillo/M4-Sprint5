import React, { useContext, useEffect, useState } from "react";
import SongContext from "../context/SongContextContext";
import SongForm from "../components/SongForm";
import { useParams, useNavigate } from "react-router-dom";

export default function SongEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSong, updateSong } = useContext(SongContext);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSong(id);
        setInitial(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, [id, getSong]);

  const handleUpdate = async (payload) => {
    setSaving(true);
    try {
      const updated = await updateSong(id, payload);
      if (updated && updated.id) {
        navigate(`/songs/${id}`);
      } else {
        window.toast && window.toast.error("Failed to redirect, please try again.");
      }
    } catch (err) {
      window.toast && window.toast.error("Error updating song");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">loading...</p>;
  if (!initial) return <p className="p-4">No results</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent">
        Edit song
      </h2>
      <SongForm initial={initial} onSubmit={handleUpdate} loading={saving} />
    </div>
  );
}
