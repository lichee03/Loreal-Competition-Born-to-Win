import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- add this line
// import connectDB from './config/db.js';
import geminiRoutes from './routes/geminiRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // <-- add this line
// app.options('*', cors({ origin: 'http://localhost:3000' }));



app.use(express.json());


// Routes
app.use('/api', geminiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
