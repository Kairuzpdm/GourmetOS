import { useState, useEffect, useCallback } from 'react';
import { MesaService } from '../services/MesaService';

export function useMesas() {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMesas = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const data = await MesaService.getAll();
            setMesas(data);
            setError(null);
        } catch (err) {
            setError('Error al obtener las mesas');
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMesas();
        // Polling cada 2 segundos para actualización automática silenciosa
        const interval = setInterval(() => fetchMesas(true), 2000);
        return () => clearInterval(interval);
    }, [fetchMesas]);

    return { mesas, loading, error, refetch: fetchMesas };
}
