import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Skipping MongoDB connection.');
    return;
  }
  if (global._mongoose && global._mongoose.conn) {
    console.log('Using cached MongoDB connection');
    return global._mongoose.conn;
  }

  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }

  if (!global._mongoose.promise) {
    mongoose.set('strictQuery', false);

    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: false
    };

    global._mongoose.promise = mongoose.connect(uri, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        global._mongoose = { conn: null, promise: null };
        throw err;
      });
  }

  global._mongoose.conn = await global._mongoose.promise;
  console.log('MongoDB Connected Successfully');
  return global._mongoose.conn;
};

export { connectDB };