export const initAuthForm = {
  email: '',
  password: '',
  passwordConfirm: '',
  disabled: true,
  isLoading: false,
};

export const AuthFormTypes = {
  UPDATE_FROM: 'update_form',
  TOGGLE_LOADING: 'toggle_loading',
  RESET: 'reset',
};

export const authFormReducer = (state, action) => {
  switch (action.type) {
    case AuthFormTypes.UPDATE_FROM:
      return { ...state, ...action.payload };
    case AuthFormTypes.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case AuthFormTypes.RESET:
      return initAuthForm;
    default:
      return state;
  }
};
