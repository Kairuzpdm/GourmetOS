const Producto = require('../models/productoModel');

const getAll = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo productos' });
    }
};

const create = async (req, res) => {
    try {
        const id = await Producto.create(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando producto' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.update(id, req.body);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando producto' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.delete(id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando producto' });
    }
};

module.exports = { getAll, create, update, remove };
