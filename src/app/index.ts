import DeviceService from './service/device'
import DAO from './dao'
import Service from './service'

class App {
    service: Service

    private options: Options
    private dao: DAO

    constructor(options: Options){
        this.options = options
    }

    async run(){
        this.dao = new DAO(this.options.mongoAddr, this.options.mongoDBName);
        this.service = new Service(this.dao);
        await this.dao.run();
    }

    shutdown(){
        this.dao.shutdown();
    }
}

type Options = {
    mongoAddr: string
    mongoDBName: string
    redisAddr?: string
}

export default App;
export {
    Options,
}