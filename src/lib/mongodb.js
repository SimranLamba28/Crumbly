import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(mongoose => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default connect;
