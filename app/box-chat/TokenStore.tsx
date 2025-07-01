"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TokenStore({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Save token to localStorage
  const handleSave = () => {
    localStorage.setItem("access_token", token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Clear saved message after 2s
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Nhập Access Token</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-black transition">
        <X size={24} />
      </button>
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded"
        placeholder="Access token..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Lưu Token
      </button>
      {saved && <p className="text-green-600">Token đã được lưu!</p>}
    </div>
  );
}
