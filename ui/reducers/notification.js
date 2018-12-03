const INITIAL_STATE = {
  message: null,
  type: null,
  timeout: null
};

const notificationReducer = (state = INITIAL_STATE, { type, notification }) => {
  switch (type) {
    case 'SHOW_MESSAGE':
      return { ...notification };
    case 'HIDE_MESSAGE':
      return INITIAL_STATE;
  }
  return state;
};

module.exports = notificationReducer;
