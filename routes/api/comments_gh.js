import express from 'express';
import { fetchComments } from '../handler/comments_fetch.js' ;
const router = express.Router();


router.post('/comments', async (req, res) => {
    const url  = req.body.name;
    console.log(`Received url -> ${url}`);
    try{
        const data=await fetchComments(url);
        res.send({ success: true , data:data});
    } catch (error) {
        console.log(`Error fetching comments: ${error}`);
        res.status(404).send({ success: false , error: error });
    }
    
});
 


export default router;