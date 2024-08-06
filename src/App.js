import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post('https://invoice-parser-6b1o.onrender.com/upload', formData, {
        responseType: 'blob',  // Ensure response is treated as blob
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Create a blob object URL for the response data
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL to free up memory
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setMessage("File converted and downloaded successfully!");
    } catch (error) {
      console.error('Error converting file:', error);
      setMessage("Failed to convert the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload PDF to Convert to Excel</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="application/pdf" 
            required 
            className="mb-4 p-2 border border-gray-300 rounded-lg"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload and Convert"}
          </button>
        </form>
        {loading && <ClipLoader size={35} color={"#123abc"} />}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default App;
