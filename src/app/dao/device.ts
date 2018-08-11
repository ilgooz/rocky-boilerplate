import { Db } from 'mongodb'
import Device from '../model/device'

class DeviceDAO {
    private db: Db
    collectionName: string = "devices"
    
    constructor(db: Db){
        this.db = db;
    }

    async create(device: Device) {
        device.createdAt = new Date;
        await this.db.collection(this.collectionName).insert(device)
    }
}

export default DeviceDAO;