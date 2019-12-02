// keys.js figure out which set of keys to return
if(process.env.NODE_ENV == 'production'){
    // we are in production environment
    module.exports = require('./prod');
}

else{
    // inside development environment
    module.exports = require('./dev');
}

