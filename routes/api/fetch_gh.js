import express from 'express';
import { fetchCommentsPerIssue } from '../handler/github_fetch.js' ;
const router = express.Router();


router.post('/fetch', async (req, res) => {
    const fullname  = req.body.name;
    try{
        const data = await fetchCommentsPerIssue(fullname);
        res.send({ success: true , data:data});
    } catch (error) {
        console.log(`Error fetching comments: ${error}`);
        res.status(404).send({ success: false , error: error });
    }
    
});
 


export default router;