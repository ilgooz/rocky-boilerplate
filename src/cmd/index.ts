import * as program from 'commander'
import * as gracefulShutdown from 'http-graceful-shutdown'
import API from '../api';

program.option('-a, --address', 'Listen address')
    .option('-m, --mongoAddress', 'Mongodb address')
    .parse(process.argv);

const api = new API({
    appOptions: {
        mongoAddr: "mongodb://127.0.0.1:27017",
        mongoDBName: "tunnel",
    },
    listenAddress: program.address || "4040",
});

(async () => {
    await api.start();
    console.log("server has been started");
})()

gracefulShutdown(api.server,
    {
        signals: 'SIGINT SIGTERM',
        timeout: 30000,
        finally: async () => {
            console.log("\nserver shutdown");
            await api.shutdown();
        }
    }
);
