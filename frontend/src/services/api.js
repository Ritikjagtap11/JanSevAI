import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const saveCitizenData = async (data) => {
    const response = await api.post('/citizens', data);
    return response.data;
};

export const analyzeEligibility = async (citizenId, citizenData) => {
    const response = await api.post('/citizens/analyze', { citizenId, citizenData });
    return response.data;
};

export const getSchemes = async () => {
    const response = await api.get('/schemes');
    return response.data;
};

export default api;
