import { SignInButton } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

export function FarcasterSignIn() {
  return (
    <div className="flex justify-center mb-6">
      <SignInButton />
    </div>
  );
}

export default FarcasterSignIn;



