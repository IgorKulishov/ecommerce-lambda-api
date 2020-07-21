const jwt = require('jsonwebtoken');

// Set in `environment` of serverless.yml
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, callback) => {
    console.log('event', event);
    if (!event.authorizationToken) {
        return callback('Unauthorized');
    }

    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        // no auth token!
        return callback('Unauthorized');
    }
    const options = {
        audience: CLIENT_ID,
    };


    if(CLIENT_ID && CLIENT_PUBLIC_KEY) {
        try {
            jwt.verify(tokenValue, CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
                if (verifyError) {
                    console.log('verifyError', verifyError);
                    // 401 Unauthorized
                    console.log(`Token invalid. ${verifyError}`);
                    return callback('Unauthorized');
                }
                // is custom authorizer function
                console.log('valid from customAuthorizer', decoded);
                return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
            });
        } catch (err) {
            console.log('catch error. Invalid token', err);
            return callback('Unauthorized');
        }
    } else {
        /** Temp solution start until the public key is set **/
        if(!!tokenValue) {
            console.log('valid from customAuthorizer, token : ', tokenValue);
            const harcodedUserId = '123user';
            return callback(null, generatePolicy(harcodedUserId, 'Allow', event.methodArn));
        } else {
            console.log('catch error. Invalid token', err);
            return callback('Unauthorized');
        }
    }
};
