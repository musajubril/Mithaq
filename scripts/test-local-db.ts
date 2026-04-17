import mongoose from "mongoose";

const localUri = "mongodb://localhost:27017/marriage-questionnaire";

async function check() {
  try {
    await mongoose.connect(localUri);
    console.log("Connected to local MongoDB");
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`Collection ${coll.name} has ${count} documents`);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Local DB check failed:", error);
    process.exit(1);
  }
}

check();
