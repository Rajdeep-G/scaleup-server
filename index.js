import express from 'express';
import bodyParser from 'body-parser';
import test_api  from './routes/api/test_api.js';
// import fetch_gh from './routes/api/fetch_gh.js';
import comments_gh from './routes/api/comments_gh.js';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', test_api);
// app.use('/api/gh', fetch_gh);
app.use('/api/gh', comments_gh);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));