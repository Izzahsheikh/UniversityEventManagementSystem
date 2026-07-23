require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const userModel = require('../models/userModel');

const run = async () => {
    await userModel.ensureTable();

    const admins = [
        { fullName: 'Admin One', email: process.env.ADMIN1_EMAIL, password: process.env.ADMIN1_PASSWORD },
        { fullName: 'Admin Two', email: process.env.ADMIN2_EMAIL, password: process.env.ADMIN2_PASSWORD },
    ];

    for (const admin of admins) {
        if (!admin.email || !admin.password) continue;
        const existing = await userModel.findByEmail(admin.email);
        if (existing) {
            console.log(`Admin already exists: ${admin.email}`);
            continue;
        }
        const hashed = await bcrypt.hash(admin.password, 10);
        await userModel.createUser(admin.fullName, admin.email, hashed, 'admin');
        console.log(`Admin created: ${admin.email}`);
    }
    process.exit(0);
};

run().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});