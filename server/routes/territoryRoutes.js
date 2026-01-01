import express from 'express';
import Territory from '../models/Territory.js';

const router = express.Router();

// Get all territories
router.get('/', async (req, res) => {
    try {
        const territories = await Territory.find().sort({ regionId: 1 });
        res.json({ success: true, count: territories.length, data: territories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create new territory
router.post('/', async (req, res) => {
    try {
        const territory = await Territory.create(req.body);
        res.status(201).json({ success: true, data: territory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Update territory
router.put('/:id', async (req, res) => {
    try {
        const territory = await Territory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!territory) {
            return res.status(404).json({ success: false, message: 'Territory not found' });
        }
        res.json({ success: true, data: territory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete territory
router.delete('/:id', async (req, res) => {
    try {
        const territory = await Territory.findByIdAndDelete(req.params.id);
        if (!territory) {
            return res.status(404).json({ success: false, message: 'Territory not found' });
        }
        res.json({ success: true, message: 'Territory deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

export default router;
