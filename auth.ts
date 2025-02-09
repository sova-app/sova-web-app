import { firebaseApp } from "@/firebase";
import { getAuth } from "firebase/auth";

export const firebaseAuth = getAuth(firebaseApp);