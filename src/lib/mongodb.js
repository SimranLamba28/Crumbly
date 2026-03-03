import dns from 'dns';
import mongoose from 'mongoose';

const isLocal = process.env.NEXT_PUBLIC_ENV === 'local';

if (isLocal) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing");

let cached = globalThis.mongoose ?? (globalThis.mongoose = { conn: null, promise: null });

async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
    };

    if (isLocal) {
      options.tls = true;
      options.family = 4;
      options.directConnection = true;
      options.lookup = (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      };
    }

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected!');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    cached.promise = null;
    throw error;
  }
}

export default connect;