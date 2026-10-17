import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_CONNECTION;

  if (!mongoUri) {
    throw new Error(
      "Falta la variable de entorno MONGO_CONNECTION en el archivo .env",
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("🔄 [Database]: Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("❌ Error crítico al conectar a la base de datos:", error);
    throw error;
  }
};
