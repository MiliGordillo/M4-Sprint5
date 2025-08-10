import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center">
  <h2 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-green-600 to-lime-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">404</h2>
      <p className="mt-2">Página no encontrada</p>
  <Link to="/" className="mt-4 inline-block text-green-600">Volver al inicio</Link>
    </div>
  );
}
