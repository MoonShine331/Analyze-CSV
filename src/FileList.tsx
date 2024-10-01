import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './axiosConfig';

interface File {
  id: number;
  name: string;
  file: string;
  uploaded_at: string;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<number[]>([]); // Track files marked for deletion
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('files/');
  const navigate = useNavigate();

  useEffect(() => {
    const storedSelectedFile = localStorage.getItem('selectedFile');
    if (storedSelectedFile) {
      setSelectedFile(Number(storedSelectedFile)); // Set the selected file from localStorage
    }
  }, []); // This effect runs only once, on mount.

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await api.get(currentPage);
        setFiles(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      } catch (error) {
        console.error('There was an error fetching the files!', error);
        setMessage('Failed to load files.');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [currentPage]);

  const goToNextPage = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const goToPreviousPage = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
    }
  };

  const handleFileSelection = (fileId: number) => {
    setSelectedFile(fileId);
    localStorage.setItem('selectedFile', String(fileId));
  };
  const handleVisualization = () => {
    if (selectedFile) {
      console.log(selectedFile);
      navigate(`/dashboard`); // Navigate to visualization with selected file ID
    } else {
      alert('Please select a file to visualize.');
    }
  };
  const handleDelete = (fileId: number) => {
    // Instead of deleting the file immediately, mark it for deletion
    setDeletedFiles([...deletedFiles, fileId]);
    setFiles(files.filter(file => file.id !== fileId)); // Remove the file from the displayed list
    setMessage('File marked for deletion.');
  };

  const handleSave = async () => {
    try {
      for (const fileId of deletedFiles) {
        await api.delete(`files/${fileId}/`); // Now actually delete from the backend
      }
      setDeletedFiles([]); // Clear the list of marked files
      setMessage('Changes saved successfully!');
    } catch (error) {
      console.error('Error deleting the file', error);
      setMessage('Failed to delete files.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl text-white font-bold mb-4">Uploaded Files</h1>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <>
          <table className="min-w-full table-auto bg-[#1C242E] text-white rounded-lg text-center mt-10">
            <thead className="bg-[#1C2D3E]">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Select for chart</th>
                <th className="px-4 py-2">File Name</th>
                <th className="px-4 py-2">Uploaded At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.id} className={`hover:bg-gray-700 ${deletedFiles.includes(file.id) ? 'opacity-50' : ''}`}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="radio"
                      name="fileSelect"
                      value={file.id}
                      checked={selectedFile === file.id}
                      onChange={() => handleFileSelection(file.id)}
                      className="form-radio h-5 w-5 text-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">{file.name}</td>
                  <td className="px-4 py-2">{new Date(file.uploaded_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            {previousPage && (
              <button
                onClick={goToPreviousPage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Previous
              </button>
            )}
            {nextPage && (
              <button
                onClick={goToNextPage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-10">
            <button
              onClick={handleVisualization}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Visualize Data
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileList;
