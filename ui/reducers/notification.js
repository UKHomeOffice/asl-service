const INITIAL_STATE = {
  message: null,
  type: null
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SHOW_MESSAGE':
      return { message: action.message, type: action.type || 'alert' };
    case 'SHOW_ERROR':
      return { message: action.message, type: 'error' };
    case 'HIDE_MESSAGE':
      return INITIAL_STATE;
  }
  return state;
};

module.exports = notificationReducer;
