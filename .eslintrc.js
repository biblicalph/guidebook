module.exports = {
    "env": {
        // support new ES6+ globals such as Set. Also enables es6+ syntax
        "es6": true,
        "node": true,
        "jest": true
    },
    "extends": ["airbnb-base", "plugin:prettier/recommended"],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    }
};