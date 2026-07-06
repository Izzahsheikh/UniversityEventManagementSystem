const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const db = require('../config/database');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message prompt is empty' });
        }

        // Fallback string directly overrides if environment system lookup stumbles
        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            console.error("⚠️ Error: GEMINI_API_KEY could not be extracted.");
            return res.status(500).json({ message: 'API key configuration missing on server' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const [events] = await db.execute("SELECT title, date, category, venue, description FROM Events WHERE status = 'approved'");
        
        const contextString = events.map(e => 
            `Event: ${e.title}\nDate: ${e.date}\nCategory: ${e.category}\nVenue: ${e.venue}\nDescription: ${e.description}`
        ).join('\n\n');

        const systemInstruction = `
            You are an assistant for the University Event Management System. 
            Answer the user's question accurately using only the following university event database context:
            ${contextString || 'No upcoming events currently scheduled.'}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction
            }
        });

        res.status(200).json({ reply: response.text });

    } catch (error) {
        console.error("Gemini Execution Error:", error);
        res.status(500).json({ message: 'AI processing failed' });
    }
});

module.exports = router;