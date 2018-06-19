const { createStore, combineReducers } = require('redux');

const rootReducer = combineReducers({ static: (state = {}) => state });
module.exports = createStore(rootReducer, window.INITIAL_STATE);
