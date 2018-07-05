import Device from './device'
import DeviceService from './device';
import DAO from '../dao';

class Service {
    device: DeviceService

    private dao: DAO
    constructor(dao: DAO){
        this.dao = dao;
        this.device = new DeviceService(this.dao);
    }
} 

export default Service