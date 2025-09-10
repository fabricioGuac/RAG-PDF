import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

export default function ProtectedRoute({ children }: { children: ReactNode }){
    // If there is not current user (Not logged in) redirect to auth page
    if (!auth.currentUser) return <Navigate to="/auth" replace/>

    return children;
}