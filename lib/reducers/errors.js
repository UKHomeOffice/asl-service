const INITIAL_STATE = {};

const errors = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ERRORS':
      return {
        ...action.errors
      };
  }
  return state;
};

module.exports = errors;
