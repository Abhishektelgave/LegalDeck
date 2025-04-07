import mongoose from 'mongoose';

// get mogodb uri
const MONGODB_URI = process.env.MONGODB_URI;

// check for cache memo
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Simplified options since deprecated ones are removed
    const options = {
      // Time wait to control server selection
      serverSelectionTimeoutMS: 5000, 
    };

    // Establishing the connection
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
