import jwt from 'jsonwebtoken';
import redis from "redis";
//todo muset be out of here
import base64 from 'base-64';
const redisclient = redis.createClient();
//
const methods = ["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH", "COPY", "HEAD", "SOCKET"];
class BaseApi {
    constructor(shared, base_path) {
        for (let i in shared) global[i] = shared[i];
        for (let method in this) {
            for (let type of this[method].types || []) {
                this[type.toUpperCase()] = this[type.toUpperCase()] || {}
                this[type.toUpperCase()][method] = this[method]
            }
        }
    }
    async postman(base_path, item = [], variable = []) {
        for (let method in this)
            for (let i in this[method]) {
                var preitmes = await this[method][i].validators;
                var mitems = [];
                for (let key in preitmes) {
                    let { description, "default": _default, presence } = preitmes[key] && preitmes[key]._flags ? preitmes[key]._flags : {};
                    mitems.push({ key, value: (_default || ""), description: "[" + preitmes[key].type + "]" + (description || preitmes[key].desc) + (presence == "required" ? "*" : "") });
                }
                item.push({
                    name: i,
                    request: {
                        auth: this.auth ? (i == "login" ? login_auth : api_auth) : {},
                        method,
                        header: [],
                        url: {
                            raw: `{{baseUrl}}/${base_path}/${i}`,
                            host: ["{{baseUrl}}"],
                            path: [base_path, i],
                            query: method == "GET" ? mitems : {}
                        }, body: method != "GET" ? {
                            mode: "formdata",
                            formdata: mitems
                        } : {}
                    }
                });
            }

        delete item.auth;
        return { name: base_path, item };
    }
    async auth(auth, route, user = { id: 0, authorization: false }) {
        if (auth && auth.slice(-1) == "=" && route == "login") {
            try { auth = base64.decode(auth); } catch (err) { return { id: 0, authorization: false }; }
            if (auth == client + ":" + secret) return { id: "*", authorization: true };
        } else try {
            user = jwt.verify(auth, publicKey, { subject: client, algorithm });
            let blacklist = await new Promise(resolve => redisclient.get(`black_list_${user.iat}`, (e, v) => resolve(v)));
            if (blacklist) user = { id: 0, authorization: false };
        } catch (e) { return user; };
        return { ...user, authorization: true };
    }
}
for (let method of methods) {
    BaseApi[method.toLowerCase()] = (target, key, descriptor) => {
        descriptor.enumerable = true;
        descriptor.value = descriptor.value || descriptor.initializer()
        let fn = descriptor.value
        delete descriptor.initializer
        fn.types = fn.types || []
        fn.valid = fn.valid || {}
        fn.types.push(method.toLowerCase())
        return descriptor
    };
}
BaseApi.valid = (validators) => (target, key, descriptor) => {
    descriptor.enumerable = true;
    descriptor.value = descriptor.value || descriptor.initializer()
    delete descriptor.initializer
    let fn = descriptor.value
    fn.types = fn.types || []
    fn.valid = validators
    return descriptor
};
export default BaseApi;