import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Get settings (create default if not exists)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update settings
router.put('/', async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
