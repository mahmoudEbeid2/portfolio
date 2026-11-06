import mongoose from "mongoose";

const DB_NAME = "portfolio";

// Reused across hot reloads and warm serverless invocations.
const cached = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");

  cached.mongooseConnection ??= mongoose
    .connect(uri, { dbName: DB_NAME, bufferCommands: false, serverSelectionTimeoutMS: 10_000 })
    .catch((error: unknown) => {
      cached.mongooseConnection = undefined;
      throw error;
    });

  return cached.mongooseConnection;
}
