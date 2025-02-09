import { firebaseAuth } from "@/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  updateEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

export type AuthError = {
  code: string;
  message: string;
};

export type SignUpData = {
  email: string;
  password: string;
  name?: string;
};

export type UpdateProfileData = {
  displayName?: string | null;
  photoURL?: string | null;
};

export type AuthResponse = {
  success: boolean;
  error?: AuthError;
  data?: unknown;
};

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    return {
      success: true,
      data: userCredential.user,
    };
  } catch (error) {
    const _error = error as AuthError;

    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function signUp({
  email,
  password,
  name,
}: SignUpData): Promise<AuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    return {
      success: true,
      data: userCredential.user,
    };
  } catch (error) {
    const _error = error as AuthError;

    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    await firebaseAuth.signOut();
    // await deleteSession()

    return {
      success: true,
    };
  } catch (error) {
    const _error = error as AuthError;
    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return {
      success: true,
    };
  } catch (error) {
    const _error = error as AuthError;
    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function updateUserProfile(
  data: UpdateProfileData
): Promise<AuthResponse> {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No user logged in");

    await updateProfile(user, data);
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    const _error = error as AuthError;
    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function updateUserEmail(newEmail: string): Promise<AuthResponse> {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No user logged in");

    await updateEmail(user, newEmail);
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    const _error = error as AuthError;
    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export async function updateUserPassword(
  newPassword: string
): Promise<AuthResponse> {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No user logged in");

    await updatePassword(user, newPassword);
    return {
      success: true,
    };
  } catch (error) {
    const _error = error as AuthError;
    return {
      success: false,
      error: {
        code: _error?.code || "auth/unknown-error",
        message: getAuthErrorMessage(_error),
      },
    };
  }
}

export const AUTH_ERROR_MESSAGES: { [key: string]: string } = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/operation-not-allowed":
    "Email/password accounts are not enabled. Please contact support.",
  "auth/weak-password": "Please choose a stronger password.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/invalid-login-credentials": "Invalid email or password.",
  "auth/requires-recent-login": "Please sign in again to complete this action.",
  default: "An error occurred. Please try again.",
};

export function getAuthErrorMessage(error: AuthError): string {
  return AUTH_ERROR_MESSAGES[error.code] || AUTH_ERROR_MESSAGES.default;
}
