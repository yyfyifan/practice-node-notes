const path = require('path');
const util = require('util');
const router = require('express').Router();
const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const usersModel = require('../models/users-superagent');
const DBG = require('debug');

// const { sessionCookieName } = require('../app');

const debug = DBG("notes:router-users");
const error = DBG("notes:error-users");

// 使用local strategy，即自己来查询user
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            let check = await usersModel.userPasswordCheck(username, password);
            if (check.check) {
                done(null, { id: check.username, username: check.username });
            } else {
                done(null, false, check.message);
            }
        } catch(err) {
            done(err);
        }
    }
));

// 注册让passport如何对user序列化、反序列化的办法
passport.serializeUser((user, done) => {
    try {
        done(null, user.username);
    } catch(err) {
        done(err);
    }
})
passport.deserializeUser(async (username, done) => {
    try {
        let user = await usersModel.find(username);
        done(null, user);
    } catch(err) {
        done(err);
    }
});


// helper function, 如果一个 router需要用户已经验证过，则可以调用他
const ensureAuthenticated = (req, res, next) => {
    try {
        if (req.user) {
            next();
        } else {
            res.redirect("/users/login");
        }
    } catch (err) {
        next(err);
    }
}

router.get("/login", (req, res, next) => {
    try {
        res.render("login", {
            title: "Login to Notes"
        });
    } catch (err) {
        next(err);
    }
});

router.post("/login", passport.authenticate('local',
    {
        failureRedirect: "login",
        successRedirect: "/"
    })
);

router.get("/logout", (req, res, next) => {
    try {
        // 清除session中保存的用户登录信息
        req.session.destroy();
        req.logout();
        // 清除用户保存在cookie中的sessionid
        // res.clearCookie(sessionCookieName);
    } catch (err) {
        next(err);
    }
});

module.exports = {
    ensureAuthenticated,
    router
}