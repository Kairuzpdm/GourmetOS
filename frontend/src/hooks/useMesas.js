import { useState, useEffect, useCallback } from 'react';
import { MesaService } from '../services/MesaService';

export function useMesas() {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMesas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await MesaService.getAll();
            setMesas(data);
            setError(null);
        } catch (err) {
            setError('Error al obtener las mesas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMesas();
        // Polling cada 2 segundos para actualización automática
        const interval = setInterval(fetchMesas, 2000);
        return () => clearInterval(interval);
    }, [fetchMesas]);

    return { mesas, loading, error, refetch: fetchMesas };
}
