import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) throw new Error('Falta MONGODB_URI en las variables de entorno');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB conectado correctamente');
}
