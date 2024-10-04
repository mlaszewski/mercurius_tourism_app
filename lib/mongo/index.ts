import { MongoClient, MongoClientOptions } from 'mongodb';

const URI = process.env.MONGO_DATABASE_URL;
const options: MongoClientOptions = {};

if (!URI) throw new Error('Please add your Mongo URI to .env');

const client: MongoClient = new MongoClient(URI, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
