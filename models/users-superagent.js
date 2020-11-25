const request = require('superagent');
const util = require('util');
const URL = require('url').URL;
const DBG = require('debug');
const debug = DBG("notes:users-superagent");
const error = DBG("notes:error-superagent");

// 硬编码的，使用BasicAuth方式验证
const authid = 'them';
const authcode = "D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF";

const reqURL = path => {
    const requestURL = new URL(process.env.USER_SERVICE_URL);
    requestURL.pathname = path;
    return requestURL.toString();
}

const create = async (username, password, provider, familyName, givenName, middleName,
    emails, photos) => {
    // 像User server发送请求
    const res = await request.post(requestURL("/create-user"))
        .send({
            username, password, provider, familyName,
            middleName, givenName, emails, photos
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

const update = async (username, password, provider, familyName, givenName, middleName,
    emails, photos) => {
    const res = await request.post(requestURL(`/update-user/${username}`))
        .send({
            username, password, provider, familyName,
            middleName, givenName, emails, photos
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

const find = async (username) => {
    const res = await request.get(reqURL(`/find/${username}`))
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

const userPasswordCheck = async (username, password) => {
    const res = await request.post(reqURL(`/password-check`))
        .send({ username, password })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

const listUsers = async () => {
    const res = await request.get(reqURL("/list"))
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

// profile 对象会由Passport来提供
const findOrCreate = async profile => {
    const res = await request.post(reqURL("/find-or-create"))
        .send({
            username: profile.id, 
            password: profile.password, 
            provider: profile.provider, 
            familyName: profile.familyName,
            middleName: profile.middleName, 
            givenName: profile.givenName, 
            emails: profile.emails, 
            photos: profile.photos
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth(authid, authcode);
    return res.body;
}

module.exports = {
    findOrCreate,
    find, 
    update,
    listUsers,
    userPasswordCheck,
    create
}