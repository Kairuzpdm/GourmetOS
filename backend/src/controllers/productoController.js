const productoService = require('../services/ProductoService');

const getAll = async (req, res, next) => {
    try {
        const productos = await productoService.getAll();
        res.json(productos);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const id = await productoService.create(req.body);
        res.status(201).json({ message: 'Producto creado', id });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productoService.update(id, req.body);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productoService.delete(id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, create, update, remove };
