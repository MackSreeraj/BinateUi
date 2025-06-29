import mongoClient from '@/lib/mongodb';

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = await mongoClient;
    const db = client.db();
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    console.log('✅ Database setup completed successfully');
    
    // Get some stats
    const stats = await db.stats();
    console.log('📊 Database stats:', {
      name: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
    });
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    const client = await mongoClient;
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the setup
setupDatabase();
