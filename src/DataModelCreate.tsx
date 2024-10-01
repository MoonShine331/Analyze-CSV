import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';

const DataModelCreate: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [fileUploads, setFileUploads] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        // Fetch the list of uploaded files for linking
        const fetchFiles = async () => {
            try {
                const response = await axios.get('files/');
                setFileUploads(response.data.results);
            } catch (error) {
                console.error('Error fetching files', error);
            }
        };
        fetchFiles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('data-models/', {
                name: name,
                linked_tables: selectedFiles
            });
            setMessage('Data model created successfully!');
        } catch (error) {
            console.error('Error creating data model', error);
            setMessage('Failed to create data model.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create Data Model</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Model Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Link Files:</label>
                    {fileUploads.map((file) => (
                        <div key={file.id}>
                            <input
                                type="checkbox"
                                value={file.id}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setSelectedFiles(
                                        e.target.checked
                                            ? [...selectedFiles, value]
                                            : selectedFiles.filter((id) => id !== value)
                                    );
                                }}
                            />
                            <label>{file.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Data Model
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default DataModelCreate;
