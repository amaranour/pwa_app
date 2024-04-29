const express = require('express');

const app = express();
const PORT = 80;  // process.env.PORT;

app.use(express.json());

const APIRouter = require('./APIRoutes');

app.use(APIRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));