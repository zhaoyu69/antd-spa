/* config-overrides.js */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireDefinePlugin = require('react-app-rewire-define-plugin');
// const path = require('path');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess(config, env);
    config = rewireDefinePlugin(config, env, {
        __DEV__: false
    });
    return config;

    // config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    // console.log(`Rules: ${JSON.stringify(config.module.rules, (key, value) => { return (value && value.constructor === RegExp) ? value.toString() : value}, 2)}`);
    // console.log(`PathSep: ${path.sep}`);
    // throw new Error('Escape here...');
};
