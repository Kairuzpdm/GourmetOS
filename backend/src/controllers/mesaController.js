const mesaService = require('../services/MesaService');

const getAll = async (req, res, next) => {
    try {
        const mesas = await mesaService.getAll();
        res.json(mesas);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const id = await mesaService.create(req.body);
        res.status(201).json({ message: 'Mesa creada', id });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        await mesaService.update(id, req.body);
        res.json({ message: 'Mesa actualizada' });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await mesaService.delete(id);
        res.json({ message: 'Mesa eliminada' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, create, update, remove };
