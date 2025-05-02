const models = require("../database/models");

const createUser = async (req, res) => {
    try {
        const user = await models.juankuri.create(req.body);
        return res.status(201).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    console.log('getting users');
    try {
        const users = await models.juankuri.findAll({ include: [] });
        console.log("Users fetched:", users); 
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send(error.message);
    }
};

const updateUser = async (req, res) => {
    console.log('update users');
    try {
        const { id } = req.params;
        const [updated] = await models.juankuri.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedUser = await models.juankuri.findOne({ where: { id: id } });
            return res.status(200).json({ user: updatedUser });
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await models.juankuri.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(200).json({ message: 'User deleted' });
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
};