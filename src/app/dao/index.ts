import Device from './device'
import { MongoClient, Db } from 'mongodb'
import DeviceDAO from './device';

class DAO {
    private mongo: MongoClient
    private db: Db
    private mongoAddr: string
    private mongoDBName: string

    device: DeviceDAO

    constructor(mongoAddr: string, mongoDBName: string){
        this.mongoAddr = mongoAddr;
        this.mongoDBName = mongoDBName;
    }

    async run(){
        this.mongo = await MongoClient.connect(this.mongoAddr, { useNewUrlParser: true });
        this.db = this.mongo.db(this.mongoDBName);
        this.device = new DeviceDAO(this.db);
        await this.migrateIndexes();
    }

    private async migrateIndexes(){
        await this.db.collection(this.device.collectionName).createIndex(
            { expireAt: 1 }, { expireAfterSeconds: 0.5 * 60 * 60 }
        );
    }

    shutdown(){
        this.mongo.close()
    }
} 

export default DAO