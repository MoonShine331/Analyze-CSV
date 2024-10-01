import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from './axiosConfig';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    }, // Restrict file types to CSV and Excel
    maxFiles: 1,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file || fileName.trim() === '') {
      setError('Please provide a file name and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await api.post('files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {  // Check if 'total' is defined
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });
      setMessage('File uploaded successfully!');
    } catch (error) {
      setError('File upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6  w-[40%]">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Upload Your Files</h2>
      <form onSubmit={onSubmit} className="bg-[] shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="fileName" className="block text-gray-700 font-bold mb-2">
            File Name:
          </label>
          <input
            type="text"
            id="fileName"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
          />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 rounded-lg cursor-pointer focus:outline-none ${isDragActive ? 'border-blue-500' : 'border-gray-300'
            } text-center bg-[#0080DC14] h-[200px] content-center mt-10 mb-10`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">Drag & drop CSV or Excel files here, or click to select</p>
          )}
        </div>

        {file && (
          <div className="mt-4">
            <p className="text-green-600 font-bold">{file.name} selected.</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-all duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {loading && (
          <p className="mt-4 text-blue-600">Uploading: {uploadProgress}%</p>
        )}
        {message && (
          <p className="mt-4 text-green-600 font-bold">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 font-bold">{error}</p>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
