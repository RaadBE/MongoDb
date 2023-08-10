import express from 'express';
import mongodb from "mongodb";
import apiRouter from './api/api.mjs';

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('views'));

app.use('/api', apiRouter);

// app.get('/test', (req, res) => {
//     res.render('main', {results});
// });

app.use('/',apiRouter);
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`))

