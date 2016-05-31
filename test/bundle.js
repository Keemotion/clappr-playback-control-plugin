const context = require.context('.', true, /unit\/.+\.spec\.js?$/);
context.keys().forEach(context);
module.exports = context;
