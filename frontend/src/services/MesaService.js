import api from './api';

export const MesaService = {
    getAll: async () => {
        const response = await api.get('/mesas');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/mesas', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/mesas/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/mesas/${id}`);
        return response.data;
    }
};
