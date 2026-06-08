import api from './api';

export const PedidoService = {
    getActivos: async () => {
        const response = await api.get('/pedidos/activos');
        return response.data;
    },
    getPorCobrar: async () => {
        const response = await api.get('/pedidos/por-cobrar');
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/pedidos', data);
        return response.data;
    },
    cambiarEstado: async (id, estado) => {
        const response = await api.put(`/pedidos/${id}/estado`, { estado });
        return response.data;
    },
    pagar: async (id, mesa_id) => {
        const response = await api.post(`/pedidos/${id}/pagar`, { mesa_id });
        return response.data;
    }
};
