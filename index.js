// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;


// app.use(cors());
// app.use(express.json());
// const routes = require('./index.route');

// app.use('/api', routes);

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('✅ Connected to MongoDB'))
//     .catch(err => console.error('❌ MongoDB connection error:', err));



// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


// module.exports = app;

// /api/index.js
const express = require('express');
const createServer =   require('http');
const parse =   require('url');

const app = express();
app.get('/api/health-check', (req, res) => res.send('OK'));

export default function handler(req, res) {
    const parsedUrl = parse(req.url, true);
    const server = createServer(app);
    server.emit('request', req, res);
}