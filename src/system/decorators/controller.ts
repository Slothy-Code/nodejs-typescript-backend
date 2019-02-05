import * as express from 'express';
import {CacheMiddleware} from '../cache-middleware';

export function Controller(path: string) {

    return function classDecorator<T extends { new(...args: any[]): any }>(constructor: T) {

        return class extends constructor {
            private path: string = path;
            private methods: Array<any> = [];
            private router: express.Router = express.Router();

            public getPath() {
                return this.path;
            }

            public getRouter() {
                return this.router;
            }

            public setMethods(methods: Array<any>) {
                this.methods = methods;
                for (let method of this.methods) {
                    const middlewares = [];
                    if (method.middleware) middlewares.push(method.middleware);
                    if (method.cached) middlewares.push(CacheMiddleware.cacheMiddleware);

                    this.router[method.type](method.route, middlewares, method.bind(this))
                }
            }

            constructor(...args: any[]) {
                super(...args);
                if (!this.getDecoratedMethods) throw this + ` doesn't have Component decorator`;
                this.setMethods(this.getDecoratedMethods());
            }

            getDecoratedMethods(): Array<any> {
                const decoratedMethods = [];
                const allMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(this)));

                for (let method of allMethods) {
                    if (typeof this[method] === 'function' && this[method].route) {
                        decoratedMethods.push(this[method]);
                    }
                }
                return decoratedMethods;
            }

        }
    }

    //
}