import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { ClipLoader } from 'react-spinners';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: 'application/pdf',
    multiple: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.xlsx');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setMessage("Files converted and downloaded successfully!");
    } catch (error) {
      console.error('Error converting files:', error);
      setMessage("Failed to convert the files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload PDFs to Convert to Excel</h1>
        <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 w-full text-center cursor-pointer mb-4">
          <input {...getInputProps()} />
          {
            isDragActive ?
            <p>Drop the files here...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        <ul className="mb-4">
          {files.map(file => (
            <li key={file.path}>{file.path}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
