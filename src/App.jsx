import React from "react";
import AppRouter from "./Router/AppRouter";
import SongProvider from "./context/SongContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <SongProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-neutral-900">
          {/* Sidebar solo visible en sm: */}
          <Sidebar className="fixed top-0 left-0 h-full" />

          {/* Contenido principal */}
          <div className="flex flex-col flex-1 sm:ml-[80px] h-full">
            <Header />
            <main className="flex-1 px-4 sm:px-8 pt-6 sm:pt-8 overflow-y-auto">
              <AppRouter />
            </main>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          toastClassName={() =>
            "bg-neutral-900 text-white rounded-lg shadow-lg border border-neutral-800 px-4 py-3"
          }
          bodyClassName={() =>
            "text-sm font-medium text-white"
          }
          closeButton={false}
          hideProgressBar={true}
        />
      </BrowserRouter>
    </SongProvider>
  );
}

export default App;



