const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
//app.use(cors());

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use(express.json());

// DB connection (prevent re-connection on every function call)

let isDbConnected = false;
const connectDB = async () => {
  if (!isDbConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isDbConnected = true;
    console.log('✅ MongoDB connected (Vercel)');
  }
};
connectDB();

// Mount routes
const routes = require('./index.route');
app.use('/api', routes);

module.exports = app;
module.exports.handler = serverless(app);


// /api/index.js
// const express = require('express');
// const createServer =   require('http');
// const parse =   require('url');

// const app = express();
// app.get('/api/health-check', (req, res) => res.send('OK'));

// export default function handler(req, res) {
//     const parsedUrl = parse(req.url, true);
//     const server = createServer(app);
//     server.emit('request', req, res);
// }
