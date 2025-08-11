import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
  <img
    src="https://i.pinimg.com/736x/94/50/cf/9450cfe8b9ab960424022a84b75842b3.jpg"
    alt="Fondo musical"
    className="absolute inset-0 w-full h-full object-cover z-0"
    draggable="false"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10"></div>

  <div className="relative z-20 flex flex-col justify-center items-center h-full max-w-4xl px-4 text-white text-center">
    <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg">
      My{" "}
      <span className="bg-gradient-to-r from-green-400 to-lime-400 bg-clip-text text-transparent">
        favorite
      </span>{" "}
      songs
    </h1>
    <button
      className="border border-lime-400 text-lime-300 font-medium py-2 px-4 sm:px-6 rounded-full hover:bg-lime-400 hover:text-black transition-colors text-sm sm:text-lg"
      onClick={() => navigate("/songs")}
    >
      Songs
    </button>
    </div>
  </main>
  );
}





