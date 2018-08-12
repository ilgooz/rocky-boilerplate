
import App, { Options as AppOptions } from '../app'
import * as glue from 'schemaglue'
import { makeExecutableSchema } from 'graphql-tools'
import * as koa from "koa";
import * as koaRouter from 'koa-router';
import * as koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import * as http from 'http'

class API {
    private app: App
    schema: any
    private resolver: any
    private executableSchema: any
    server: http.Server
    private koa: koa
    private router: koaRouter
    private options: Options

    constructor(options: Options){
        this.options = options;
        this.app = new App(options.appOptions);
        this.setupGraphQL()
        this.setupServer()
    }

    private setupGraphQL(){
        const { schema, resolver } = glue('./src/api/graphql', { js: '**/*.ts' });
        this.schema = schema;
        this.resolver = resolver;
        this.executableSchema = makeExecutableSchema({
            typeDefs: this.schema,
            resolvers: this.resolver,
        })
    }

    private setupServer(){
        this.koa = new koa();
        this.router = new koaRouter();

        this.router.post('/graphql', koaBody(), graphqlKoa((ctx) => {
            return this.handler(ctx.req)
        }));
        this.router.get('/graphql', graphqlKoa({ schema: this.schema }));
        this.router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

        this.koa.use(this.router.routes());
        this.koa.use(this.router.allowedMethods());

        this.server = http.createServer(this.koa.callback());
    }

    private handler(req){
        return {
            schema: this.executableSchema,
            context: {
                app: this.app,
            },
        }
    }

    async start() {
        await this.app.run();
        this.server.listen(this.options.listenAddress);
    }

    async shutdown(){
        this.app.shutdown();
    }
}

type Options = {
    appOptions: AppOptions,
    listenAddress: String,
}

export default API
export {
    Options,
}
