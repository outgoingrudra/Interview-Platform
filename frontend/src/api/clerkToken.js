let getTokenFunction = null;

export const setClerkTokenGetter = (getToken) => {
  getTokenFunction = getToken;
};

export const getFreshClerkToken = async () => {
  if (!getTokenFunction) return null;

  return getTokenFunction();
};