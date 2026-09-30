import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || import.meta.env.MONGODB_URI || '';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!uri) {
  console.warn('⚠️ MONGODB_URI n\'est pas défini dans les variables d\'environnement.');
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (process.env.NODE_ENV === 'development') {
    // En développement, réutilise la connexion globale pour éviter de multiplier les connexions au hot-reload
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(dbName = 'bsf'): Promise<Db> {
  const c = await getMongoClient();
  return c.db(dbName);
}
