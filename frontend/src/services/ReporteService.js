import api from './api';

export const ReporteService = {
    getVentasDelDia: async () => {
        const response = await api.get('/reportes/ventas-hoy');
        return response.data;
    }
};
