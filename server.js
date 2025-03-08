// // server.js

// // Import required modules
// const express = require('express');
// const cors = require('cors');

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use the latest version

// require('dotenv').config(); // Load environment variables from .env file



// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 5001; // Use environment variable for port or default to 5000

// // Middleware
// app.use(cors()); // Enable CORS for frontend-backend communication
// app.use(express.json()); // Parse JSON request bodies

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Load API key from .env file

// // Route for nutritional lookup (placeholder for future implementation)
// app.post('/api/nutrition', async (req, res) => {
//     const { query } = req.body;
//     try {
//         // Placeholder: Replace with actual Nutrition API integration
//         const nutritionData = {
//             food: query,
//             calories: 100,
//             protein: 10,
//             fat: 5,
//             carbs: 15,
//         };
//         res.json(nutritionData);
//     } catch (error) {
//         console.error('Error fetching nutritional data:', error);
//         res.status(500).json({ error: 'Failed to fetch nutritional data' });
//     }
// });

// app.post("/api/mealplan", async (req, res) => {
//     const { preferences } = req.body;
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const prompt = `Generate a 7-day meal plan for someone with the following preferences: ${JSON.stringify(preferences)}`;

//         const result = await model.generateContent(prompt);
//         const mealPlan = await result.response.text(); // Ensure async response handling

//         res.json({ mealPlan });
//     } catch (error) {
//         console.error("Error in /api/mealplan:", error);
//         res.status(500).json({ error: "Failed to generate meal plan", details: error.message });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
// console.log('Google API Key:', process.env.GOOGLE_API_KEY);

// server.js

// Import required modules
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import GenAI
const mysql= require('mysql2');
const bodyParser= require('body-parser');
require('dotenv').config(); // Load environment variables from .env file


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'sarayu2005', // Replace with your MySQL password
    database: 'nutrigen', // Replace with your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Signup API
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Signup failed' });
        }
        res.status(200).json({ message: 'Signup successful' });
    });
});

// Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).json({ message: 'Login failed' });
        }
        res.status(200).json({ message: 'Login successful', user: result[0] });
    });
});
// Route for meal plan generation
app.post("/api/mealplan", async (req, res) => {
    const { preferences } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ Correct model name
        const prompt = `Generate a 7-day meal plan for someone with the following preferences: ${JSON.stringify(preferences)}`;

        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });

        // ✅ Correctly extract the response
        const mealPlan = result.response.candidates[0].content.parts[0].text;

        res.json({ mealPlan });
    } catch (error) {
        console.error("Error in /api/mealplan:", error);
        res.status(500).json({ error: "Failed to generate meal plan", details: error.message });
    }
});

// Route for nutrition lookup
app.post('/api/nutrition', async (req, res) => {
    const { query } = req.body;

    // Validate input
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid input: query must be a string' });
    }

    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        // Construct the prompt
        const prompt = `Provide detailed nutritional information for ${query}. Include calories, sugar, protein, fat, carbohydrates, and any other relevant nutrients.`;

        // Generate content
        const result = await model.generateContent(prompt);

        // Extract the response
        const nutritionData = result.response.text();

        // Send the response
        res.json({ nutritionData });
    } catch (error) {
        console.error('Error in /api/nutrition:', error);
        res.status(500).json({ error: 'Failed to fetch nutrition data', details: error.message });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
