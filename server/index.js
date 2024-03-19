import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import argumentRoutes from './routes/arguments.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/argumentSchemas', argumentRoutes);

const CONNECTION_URL = 'mongodb+srv://argupedia_admin:testing123@argupedia.g0ah99p.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 8000;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
