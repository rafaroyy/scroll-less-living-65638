import { Auth0Provider as Auth0ProviderSDK } from "@auth0/auth0-react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const domain = "dev-qowbw6kfc4stlcj1.us.auth0.com";
  const clientId = "3z57ccc1xAUqaQjxZcrLAWNSc8GiKni7";
  const redirectUri = window.location.origin;

  return (
    <Auth0ProviderSDK
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0ProviderSDK>
  );
};
