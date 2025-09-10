import { useState } from "react";
import { get } from "../utils/api";


export default function Dashboard(){

    const [responseMessage, setResponseMessage] = useState("");


    const testProtectedApiRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await get<{ message: string; uid?: string }>("/protected");
            setResponseMessage(`${res.message} with id: ${res.uid ?? "no uid"}`);
        } catch (e) {
            if (e  instanceof Error) {
                setResponseMessage(e.message);
            } else {
                setResponseMessage("An unknown error has occured");
            }            
        }
    }

    return (
        <>
        <h1>Dashboard</h1>

        <h3 className="text-xl">{responseMessage}</h3>

        <button
        onClick={testProtectedApiRoute}
        className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
        >
            <span className="text-yellow-500 mr-2">&#9733;</span>
            Try protected route
        </button>
        </>
    )
}