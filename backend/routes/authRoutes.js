const express = require('express');
const router = express.Router();

const db = require('../config/database')

router.post('/signup',async (req,res)=>{
    try
    {
        const {fullName,email,password,role}=req.body;

        await db.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                role ENUM('student', 'organizer', 'admin', 'teacher') NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        if(!fullName || !email || !password || !role ) {
            return res.status(400).json({message:'All fields are Required'});
        }

        const checkUserQuery = 'SELECT * from Users WHERE email = ?';
        const [existingUsers] = await db.execute(checkUserQuery,[email]);

        if (existingUsers.length>0)
        {
            return res.status(400).json({message:'Email already Registered'});
        }

        const insertUserQuery = 'INSERT INTO USERS (fullName,email,role,password) VALUE (?,?,?,?)';
        await db.execute(insertUserQuery,[fullName,email,role,password]);

        res.status(201).json({
            message: 'Registration Successfull',
            user:{fullName,email,role}
        });

    }catch(error){
        console.error("Database Operation Failure:",error),
        res.status(500).json({message:'Server error during Registration'});        
    }
});

module.exports=router;