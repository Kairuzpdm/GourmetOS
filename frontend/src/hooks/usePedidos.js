import { useState, useCallback } from 'react';
import { PedidoService } from '../services/PedidoService';

export function usePedidos() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearPedido = useCallback(async (mesa_id, detalles) => {
        setLoading(true);
        try {
            const res = await PedidoService.crear({ mesa_id, detalles });
            setError(null);
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { crearPedido, loading, error };
}
