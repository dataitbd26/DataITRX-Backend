import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './app/modules/User/Users.model.js'; 
import connectDB from './config/db.js'; 

dotenv.config();

const resetPassword = async () => {
  try {

    const userEmailToUpdate = 'sadatcse@gmail.com'; 
    const newPassword = '12345678'; 


    await connectDB();
    console.log('✅ Database connected.');


    const user = await User.findOne({ email: userEmailToUpdate });

    if (!user) {
      console.log(`❌ User with email "${userEmailToUpdate}" not found.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`- Found user: ${user.name} (${user.email})`);

 
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password for ${user.email} has been reset successfully.`);


    await mongoose.disconnect();
    console.log('- Database disconnected.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetPassword();