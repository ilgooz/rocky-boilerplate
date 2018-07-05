import App from '../../../app'
import Device from '../../../app/model/device'

const resolver = {
    Mutation: {
        async create(_, { name }, context,b): Promise<Device> {
            const device = {
                name: name,
            };
            return await context.app.service.device.create(device);
        },
    }
};

export {
    resolver,
}
