const util = require('util');

exports.info = (...args) => console.log('[INFO]', ...args.map(a => (typeof a === 'object' ? util.inspect(a, { depth: 2 }) : a)));
exports.warn = (...args) => console.warn('[WARN]', ...args.map(a => (typeof a === 'object' ? util.inspect(a, { depth: 2 }) : a)));
exports.error = (...args) => console.error('[ERROR]', ...args.map(a => (typeof a === 'object' ? util.inspect(a, { depth: 2 }) : a)));
