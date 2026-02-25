import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './app/modules/User/Users.model.js'; 
import connectDB from './config/db.js'; 

dotenv.config();

const seedUser = async () => {
  try {

    await connectDB();


    const adminData = {
      name: 'MD SADAT KHAN',
      email: 'sadatcse@gmail.com',
      password: '12345678', // Plain text: The User model's .pre('save') hook will hash this
      phone: '0123456789',
      role: 'admin',    // Setting as superadmin to bypass restrictions in your controller
      department: 'IT',
      branch: 'demo',
      status: 'active',
    };

    // 3. Check for Existing User
    const existingUser = await User.findOne({ email: adminData.email });
    
    if (existingUser) {
      console.log(`info: User ${adminData.email} already exists. Skipping...`.yellow);
    } else {
      // 4. Create the User
      // We use 'new User' + 'save()' to ensure the password hashing middleware triggers
      const newUser = new User(adminData);
      await newUser.save();
      
      console.log('---------------------------------');
      console.log('✅ Success: Initial User Created!'.green.bold);
      console.log(`Email: ${adminData.email}`);
      console.log(`Role:  ${adminData.role}`);
      console.log('---------------------------------');
    }

    // 5. Close connection and exit
    mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error(`❌ Error seeding user: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedUser();