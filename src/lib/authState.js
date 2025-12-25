// Global auth state accessor for non-React contexts (like API client)
let authState = {
  credentials: null,
};

export const setGlobalAuthState = (state) => {
  authState = state;
};

export const getGlobalAuthState = () => {
  return authState;
};
