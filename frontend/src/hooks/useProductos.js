import { useState, useEffect, useCallback } from 'react';
import { ProductoService } from '../services/ProductoService';

export function useProductos(soloDisponibles = false) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ProductoService.getAll();
            if (soloDisponibles) {
                setProductos(data.filter(p => p.disponible));
            } else {
                setProductos(data);
            }
            setError(null);
        } catch (err) {
            setError('Error al obtener los productos');
        } finally {
            setLoading(false);
        }
    }, [soloDisponibles]);

    useEffect(() => {
        fetchProductos();
        // Polling cada 5 segundos para productos actualizados
        const interval = setInterval(fetchProductos, 5000);
        return () => clearInterval(interval);
    }, [fetchProductos]);

    return { productos, loading, error, refetch: fetchProductos };
}
