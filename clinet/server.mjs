import express from 'express';
import mongodb from "mongodb";
import apiRouter from './api/api.mjs';

const app = express();


app.use('/api',apiRouter);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`))

