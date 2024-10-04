/* eslint-disable global-require */
import mongoose from 'mongoose';

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_DATABASE_URL!);
    require('../utils/Models/User');
    require('../utils/Models/Point');
    require('../utils/Models/Route');
    // require('../utils/Models/Reservation');
    require('../utils/Models/Schedule');
  } catch (error) {
    throw new Error('Connection failed!');
  }
}

export default dbConnect;
