import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';

interface DataModel {
    id: number;
    name: string;
    linked_tables: { name: string }[];
}

const DataModelList: React.FC = () => {
    const [dataModels, setDataModels] = useState<DataModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDataModels = async () => {
            setLoading(true);
            try {
                const response = await axios.get('data-models/');
                setDataModels(response.data);
            } catch (error) {
                console.error('Error fetching data models', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataModels();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Data Models</h2>
            {loading ? <p>Loading data models...</p> : (
                <ul>
                    {dataModels.map((model) => (
                        <li key={model.id}>
                            <h3>{model.name}</h3>
                            <ul>
                                {model.linked_tables.map((table, index) => (
                                    <li key={index}>{table.name}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DataModelList;
