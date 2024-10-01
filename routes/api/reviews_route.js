import express from 'express';
import get_reviews from '../handler/fetch_play_reviews.js';

const router = express.Router();

router.get('/reviews', async (req, res) => {
    let appId, paginate, num_of_reviews, prev_pagination_token;
    appId = req.body.appId;
    if (req.body.paginate === undefined) { paginate = false; } else { paginate = req.body.paginate; }
    if (req.body.num_of_reviews === undefined) { num_of_reviews = 150; } else { num_of_reviews = req.body.num_of_reviews; }
    if (req.body.prev_pagination_token === undefined) { prev_pagination_token = null; } else { prev_pagination_token = req.body.prev_pagination_token; }

    try {
        const reviews = await get_reviews(appId, prev_pagination_token, paginate, num_of_reviews);
        res.json({success: true, data: reviews});
    } catch (error) {
        res.status(404).json({success: false, message: error.message });
    }
});

export default router;