const validate = new (require('./Private/validate'))();
const rateLimit = new (require('./Private/rateLimit'))();
const requests = new (require('./Private/requests'))();
const API = require('./API/index');

class Client {
  constructor (key, options = {}) {
    this.key = validate.validateKey(key);
    this.options = validate.parseOptions(options);
    // eslint-disable-next-line no-return-assign

    console.log(`[hypixel-api-reborn] Using key ${key.slice(0, 8) + key.slice(8).replace(/[^-]/g, '*')}.`);
    validate.validateOptions(this.options);
  }

  init () {
    // eslint-disable-next-line no-return-assign
    Object.keys(API).forEach(func => Client.prototype[func] = API[func].bind({ _makeRequest: this._makeRequest, ...this }));

    rateLimit.init(this.getKeyInfo(), this.options.rateLimit);
  }

  async _makeRequest (url) {
    if (!url) return;
    if (url !== '/key') {
      if (requests.cache.has(url)) return requests.cache.get(url);
      rateLimit.rateLimitManager();
    }

    return requests.request.call(this, url);
  }

  get sweepCache () {
    return requests.sweepCache;
  }
}

module.exports = Client;
