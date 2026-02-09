export {
  auth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  getIdToken,
  syncUserToBackend,
  getCurrentFirebaseUser,
} from './authService';
export { promptGoogleSignIn } from './googleSignIn';
export type { AuthUser } from './authService';
