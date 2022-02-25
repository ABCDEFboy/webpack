const data = require('./data');
const mockUrl = require('./mock-url');

const extend = Object.assign;
const mocks = [...data].map(v => extend(v, { url: mockUrl(v.url) }));

module.exports = {
  mocks
};
