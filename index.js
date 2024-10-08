import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
// import test_api  from './routes/api/test_api.js';
// import fetch_gh from './routes/api/fetch_gh.js';
import comments_gh from './routes/api/comments_gh.js';
import reviews_route from './routes/api/reviews_route.js';
import health from './routes/api/health.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'logfile.log');
const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

app.use(morgan('combined', { stream: logFileStream }));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use('/api', test_api);
// app.use('/api/gh', fetch_gh);
app.use('/api/gh', comments_gh);
app.use('/api/play', reviews_route);
app.use('/api', health);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));