const taskService = require('../services/taskService');

const triggerTask = async (req, res) => {
    try {
        const result = await taskService.performTask();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to execute task',
            error: error.message
        });
    }
};

module.exports = {
    triggerTask
};