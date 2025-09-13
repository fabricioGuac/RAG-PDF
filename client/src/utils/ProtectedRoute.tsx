import { useEffect, type ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }){
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Starts listening for auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            // Updates the state variables based on the changes
            setUser(u);
            setLoading(false);
        });
        // Clean up on unmount
        return () => unsubscribe();
    }, []);

    // If loading display a loading message
    if(loading) return <p>Loading...</p>
    // If not logged in navigate to the AuthPage
    if(!user) return <Navigate to="/auth" replace />

    return children;
}