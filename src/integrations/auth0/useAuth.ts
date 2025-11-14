import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const {
    loginWithRedirect,
    logout: auth0Logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const login = () => {
    loginWithRedirect({
      appState: { returnTo: "/editor" },
    });
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return {
    login,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  };
};
