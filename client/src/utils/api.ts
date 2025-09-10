import { auth } from "../firebase/config";

const API_BASE_URL = "http://localhost:5000";

// Retrieve ID token to send to backend
const getToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if(!user) throw new Error("Not authenticated");
    return await user.getIdToken();
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