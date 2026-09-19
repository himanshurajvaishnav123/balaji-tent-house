import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const localCompassURI = 'mongodb://127.0.0.1:27017/balaji-tent-house';
  const primaryURI = process.env.MONGO_URI || localCompassURI;
  const atlasURI = process.env.ATLAS_MONGO_URI;

  try {
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}, Database -> ${conn.connection.name}`);
    if (primaryURI.includes('127.0.0.1') || primaryURI.includes('localhost')) {
      console.log(`[MongoDB Compass Ready]: Connect MongoDB Compass to "mongodb://localhost:27017" to view and edit "${conn.connection.name}" collections live!`);
    }
  } catch (error: any) {
    console.warn(`[MongoDB Warning]: Primary connection to ${primaryURI} failed: ${error.message}`);
    
    // Fallback attempt to Atlas if local failed, or vice versa
    const fallbackURI = primaryURI === localCompassURI ? atlasURI : localCompassURI;
    if (fallbackURI) {
      try {
        console.log(`[MongoDB Fallback]: Attempting connection to ${fallbackURI}...`);
        const conn = await mongoose.connect(fallbackURI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB Fallback Connected]: Host -> ${conn.connection.host}, Database -> ${conn.connection.name}`);
        return;
      } catch (fallbackError: any) {
        console.error('[MongoDB Fallback Failed]:', fallbackError.message);
      }
    }

    console.error('[MongoDB Connection Error]: Could not connect to any database instance.');
    process.exit(1);
  }
};
