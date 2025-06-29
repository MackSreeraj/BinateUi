import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  connectTimeoutMS: 10000, // Time to wait for a connection to be established
  socketTimeoutMS: 45000, // Time to wait for a response from the server
  heartbeatFrequencyMS: 10000, // How often to send heartbeats to check the connection
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    
    // Add event listeners for connection status
    client.on('serverOpening', () => {
      console.log('MongoDB server opening...');
    });
    
    client.on('serverClosed', () => {
      console.log('MongoDB server closed');    
    });
    
    // Handle connection errors
    client.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    globalWithMongo._mongoClientPromise = client.connect()
      .then(connectedClient => {
        console.log('Successfully connected to MongoDB');
        return connectedClient;
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  
  // Add production-specific event listeners
  client.on('serverHeartbeatSucceeded', () => {
    console.log('MongoDB heartbeat succeeded');
  });
  
  client.on('serverHeartbeatFailed', (err) => {
    console.error('MongoDB heartbeat failed:', err);
  });
  
  clientPromise = client.connect()
    .then(connectedClient => {
      console.log('Successfully connected to MongoDB');
      return connectedClient;
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1); // Exit the process if we can't connect in production
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
