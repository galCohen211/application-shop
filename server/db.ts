import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
const MONGODB_URL = 'mongodb://localhost:27017';

export async function connect(): Promise<Db> {
    if (!client){
        client = await MongoClient.connect(MONGODB_URL) 
    }
    return client.db('onlineshop'); 
};

export async function closeDb() {
    if(!client){
        return;
    }

    client.close();
}