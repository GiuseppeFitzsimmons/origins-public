//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
function getSigningSecret() {
    //TODO something better than this
    //return process.env.SIGNING_SECRET
    return 'ADummySigningSecret';
}
function validateToken(event) {
    //console.log('tokenevent', event)
    var signingSecret = getSigningSecret();
    var token = event.authorizationToken;
    if ((!token || token == '') && event.headers) {
        token = event.headers.Authorization;
        if (!token || token == '') {
            token = event.headers.authorization;
        }
    }
    else {
        if (event.body) {
            let _body = event.body;
            if (typeof _body == 'string') {
                _body = JSON.parse(_body);
            }
            token = _body.token;
        }
    }
    if (!token) {
        let err = new Error("Unauthorized");
        err.message = "Unauthorized";
        console.log("No token, rejecting", err);
        throw err;
    }
    if (token.toLowerCase().indexOf("bearer") == 0) {
        token = token.substr(7);
    }
    var decoded;
    if (!token || token == '') {
        console.log("No token, rejecting...");
        throw fourOhOne('error', 401);
    }
    try {
        //@ts-ignore
        decoded = jwt.verify(token, signingSecret, { ignoreExpiration: true });
        console.log("decoded", decoded);
    }
    catch (err) {
        console.log(err);
        throw fourOhOne('error', 401);
    }
    if (decoded) {
        return decoded;
        //console.log("CHECKING EXPIRY", new Date().getTime(), decoded.exp)
        /*
        if (ignoreExpiration || new Date().getTime() < decoded.exp) {
            return decoded;
        } else {
            console.log("Token is expired, rejecting...");
            throw fourOhOne("Token has expired", 'exp');
        }
        */
    }
}
;
function fourOhOne(message, code) {
    if (!message) {
        message = "Unauthorized";
    }
    let err = new Error(message);
    err.message = message;
    return err;
}
function generateNewPair(userId) {
    let signingSecret = getSigningSecret();
    console.log("generateNewPair SIGNING SECRET", signingSecret);
    let tokenPayload = {};
    tokenPayload.iss = 'origins';
    tokenPayload.sub = userId;
    var now = new Date();
    let expiry = 400;
    now.setMinutes(now.getMinutes() + expiry);
    now = new Date(now);
    tokenPayload.exp = now.getTime();
    //@ts-ignore
    var access_token = jwt.sign(tokenPayload, signingSecret);
    if (tokenPayload.scope != "PASSWORD") {
        let refreshTokenPayload = {};
        refreshTokenPayload.sub = userId;
        refreshTokenPayload.uuid = tokenPayload.uuid;
        now.setMinutes(now.getMinutes() + 6 * 60);
        refreshTokenPayload.exp = now.getTime();
    }
    return { access_token };
}
function hashAPass(password) {
    const hashingSecret = process.env.HASHING_SECRET;
    const plainText = password;
    //@ts-ignore
    const hashedPass = crypto.createHmac('sha256', hashingSecret)
        .update(plainText)
        .digest('hex');
    return hashedPass;
}
export { validateToken, generateNewPair, hashAPass, fourOhOne };
