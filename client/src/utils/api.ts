import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = import.meta.env.API_BASE_URL;

// Retrieve ID token to send to backend
const getToken = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe(); // stop listening
            if (!user) return reject(new Error("Not authenticated"));
            resolve(await user.getIdToken());
        });
    });
};

interface FetchOptions extends RequestInit {
    body?:any; // allow FormData OR raw object
}

// Function for making api calls with authentication
const fetchApi = async <T = any>(url: string, options: FetchOptions = {}): Promise<T> => {
    const token = await getToken();

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        ...(options.headers as Record<string, string> || {}), // Merges any additional headers provided in the options
    };

    // If body is FormData, we don't set Content-Type (it will be auto-set)
    if(options.body instanceof FormData) {
        delete headers["Content-Type"];
    } else if (options.body) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
    }

    // Makes the API call with the provided URL and options
    const response = await fetch(`${API_BASE_URL}${url}`,{
        ...options,
        headers
    });

    // Throws an error if the response status is not OK
    if(!response.ok) {
        const text = await response.text();
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}. Message: ${text}`);
    }
    // Parses and return the response as JSON
    return response.json();
}   

// Wrapper CRUD functions
export const get = <T = any>(url:string) => fetchApi<T>(url, { method: "GET" });
export const post = <T = any>(url: string, body?: any) => fetchApi<T>(url, { method: "POST", body });
export const put = <T = any>(url: string, body?: any) => fetchApi<T>(url, { method: "PUT", body });
export const del = <T = any>(url: string) =>  fetchApi<T>(url, { method: "DELETE" });