const categoriaService = require('../services/CategoriaService');

const getAll = async (req, res, next) => {
    try {
        const categorias = await categoriaService.getAll();
        res.json(categorias);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const id = await categoriaService.create(req.body);
        res.status(201).json({ message: 'Categoría creada', id });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        await categoriaService.update(id, req.body);
        res.json({ message: 'Categoría actualizada' });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await categoriaService.delete(id);
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, create, update, remove };
