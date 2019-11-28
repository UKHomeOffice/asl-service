const moment = require('moment');
const { omit } = require('lodash');

class Store {
  constructor(options = {}) {
    this._items = [];
    this.maxItems = options.maxItems;
    this.lifetime = options.lifetime;

    if (this.lifetime) {
      const interval = options.interval || 1000;
      setInterval(() => this.expireItems(), interval);
    }
  }

  expireItems() {
    this._items = this._items.filter(item => {
      return moment().isBefore(item.expireAt);
    });
  }

  get items() {
    return this._items.map(item => omit(item, 'expireAt'));
  }

  push(item) {
    if (this.lifetime) {
      item = {
        ...item,
        expireAt: moment().add(this.lifetime)
      };
    }
    this._items.push(item);
    if (this.maxItems && this._items.length > this.maxItems) {
      this._items.shift();
    }
  }
}

module.exports = Store;
