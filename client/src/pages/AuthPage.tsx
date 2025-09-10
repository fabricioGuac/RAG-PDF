import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function AuthPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Redirects the user to the dashboard if logged in
    useEffect(() => {
        if (auth.currentUser) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrorMessage("");
            // Create the user or log them
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // After the user is logged in redirect to dashboard
            navigate('/');
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h1 className="text-2xl font-bold mb-4">{isSignup ? "Sign Up" : "Login"}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2"
                />
                {errorMessage && <p className="text-red-400">{errorMessage}</p>}
                <button type="submit" className="bg-blue-600 text-white p-2 rounded cursor-pointer">
                    {isSignup ? "Sign Up" : "Login"}
                </button>
            </form>
            <button
                className="mt-4 text-blue-500 cursor-pointer"
                onClick={() => setIsSignup((prev) => !prev)}
            >
                {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
            </button>
        </div>
    );
}