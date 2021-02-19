import jwt from 'jsonwebtoken';
import redis from "redis";
//todo muset be out of here
import base64 from 'base-64';
const redisclient = redis.createClient();
//
String.prototype.toCapitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }
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
    // async postman(base_path, item = [], variable = []) {
    //     for (let method of methods){
    //         for (let i in this[method]) {
    //             var preitmes =  this[method][i].valid;
    //             var responses =  this[method][i].response;
    //             var test = this[method][i].test
    //             var desc = this[method][i].desc;
    //             var mitems = [],tests=[],responseModel={};
    //             for (let key in preitmes) {
    //                 let { description, "default": _default, presence } = preitmes[key] && preitmes[key]._flags ? preitmes[key]._flags : {};
    //                 mitems.push({ key, value: (_default || ""), description: "<" + preitmes[key].type.toCapitalize() + ">" + (description || preitmes[key].desc) + (presence == "required" ? "*" : "") });
    //             }
    //             for (let key in responses) {
    //                 let flags = responses[key] && responses[key]._flags ? responses[key]._flags : {};
    //                 responseModel[key] = "<" + responses[key].type.toCapitalize() + ">" + (flags.description || responses[key].desc);
    //             }
    //             for(let {params,result} of test){

    //             }
    //             let  request = {
    //                 //api_auth
    //                 auth: this.auth ? (i == "login" ? login_auth : {}) : {},
    //                 method,
    //                 header: [],
    //                 url: {
    //                     raw: `{{baseUrl}}/${base_path}/${i}`,
    //                     host: ["{{baseUrl}}"],
    //                     path: [base_path, i],
    //                     query: method == "GET" ? mitems : {}
    //                 }, body: method != "GET" ? {
    //                     mode: "formdata",
    //                     formdata: mitems
    //                 } : {},
    //                 description : desc
    //             }
    //             item.push({
    //                 name: i,
    //                 request ,
                    
    //                 response:[...tests.map((e,index)=>({
    //                     name: "test"+index,
    //                     originalRequest: request,
    //                     status: "OK",
    //                     code: 200,
    //                     _postman_previewlanguage: "json",
    //                     body:  JSON.stringify(e.result, null, 2)
    //                 })),{
    //                     name: "responseModel",
    //                     originalRequest: request,
    //                     status: "OK",
    //                     code: 200,
    //                     _postman_previewlanguage: "json",
    //                     body:  JSON.stringify(responseModel, null, 2)
    //                 }]
    //             });
    //         }
    //     }
    //     delete item.auth
    //     return { name: base_path, item ,auth:api_auth,description:this.description||""};
    // }
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
        fn.test = fn.test || {}
        fn.types.push(method.toLowerCase())
        return descriptor
    };
}
BaseApi.param = (validators) => (target, key, descriptor) => {
    descriptor.enumerable = true;
    descriptor.value = descriptor.value || descriptor.initializer()
    delete descriptor.initializer
    let fn = descriptor.value
    fn.types = fn.types || []
    fn.valid = {...fn.valid,...validators}
    fn.test = fn.test || {}
    return descriptor
};
BaseApi.response = (responses) => (target, key, descriptor) => {
    descriptor.enumerable = true;
    descriptor.value = descriptor.value || descriptor.initializer()
    delete descriptor.initializer
    let fn = descriptor.value
    fn.types = fn.types || []
    fn.responses = {...fn.responses,...responses}
    fn.valid = fn.valid || {}
    return descriptor
};
BaseApi.test = (params={},result={}) => (target, key, descriptor) => {
    descriptor.enumerable = true;
    descriptor.value = descriptor.value || descriptor.initializer()
    delete descriptor.initializer
    let fn = descriptor.value
   //fn.test = [...fn.test,{params,result}]
    return descriptor
};
BaseApi.description = (desc) => (target, key, descriptor) => {
    descriptor.enumerable = true;
    descriptor.value = descriptor.value || descriptor.initializer()
    delete descriptor.initializer
    let fn = descriptor.value
    fn.desc = desc || ""
    return descriptor
};
export default BaseApi;