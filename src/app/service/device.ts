import DAO from '../dao'
import Device from '../model/device'
import * as CryptoString from 'crypto-random-string'
import * as SHAJS from 'sha.js'

class DeviceService {
    dao: DAO

    constructor(dao: DAO){
        this.dao = dao;
    }

    async create(device: Device) {
        const token = CryptoString(32);
        const hash = SHAJS('sha256').update(token).digest('hex');
        device.tokenHash = hash;
        await this.dao.device.create(device);
        return device;
    }
}

type CreateOptions = {
    expireAfter: number
}

export default DeviceService;
