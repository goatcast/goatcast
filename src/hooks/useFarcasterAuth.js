import { useSignIn, useProfile } from '@farcaster/auth-kit';

export function useFarcasterAuth() {
  const { signIn, isSignedIn, isLoading } = useSignIn();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  return {
    signIn,
    isSignedIn,
    isLoading,
    profile,
    isLoadingProfile,
    username: profile?.username,
    displayName: profile?.displayName,
    pfpUrl: profile?.pfpUrl,
  };
}

