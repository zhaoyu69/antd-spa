/* config-overrides.js */
const { injectBabelPlugin } = require('react-app-rewired');

const rewireLess = require('react-app-rewire-less');
const rewireDefinePlugin = require('react-app-rewire-define-plugin');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireDefinePlugin(config, env, {
        __DEV__: false
    });
    return config;
};
