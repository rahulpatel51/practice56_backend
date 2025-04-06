import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Fix for __dirname in ES Modules
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Serve static files (after app is initialized)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(bodyParser.json());



// ✅ Import Category Routes
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';


// ✅ Use Category Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);



app.get('/', (req, res) => {
    res.json({ status: "API is running..." });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
