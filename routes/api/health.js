import express from 'express';

const router = express.Router();

// Health check endpoint to verify if the server is active
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running actively' });
});

export default router;