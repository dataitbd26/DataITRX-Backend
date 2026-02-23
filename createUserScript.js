// createUserScript.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './app/modules/User/Users.model.js';
import connectDB from './config/db.js';

dotenv.config();

const createUser = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Create new user details
    const userData = {
      email: 'sadat@gmail.com',
      password: '12345678',
      name: 'MD SADAT KHAN',
      role: 'admin',
      branch: 'demo',
      status: 'active',
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('❌ User already exists with this email');
      process.exit(0);
    }

    // Hash password manually (since `save()` hook may not be triggered with `create`)
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await User.create(userData);
    console.log('✅ User created successfully:', newUser.email);

    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
};

createUser();
