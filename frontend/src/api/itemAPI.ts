
import axios from 'axios';

// Set base URL as the local server URL
const API_URL = 'http://localhost:3000';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL, // Base URL for the API
  headers: {
    "Content-Type": "application/json", // Assuming JSON data is being sent
  },
});

// Function to fetch all items using the axiosInstance
export const getItems = async () => {
  try {
    const response = await axiosInstance.get('/api/item'); // Using axiosInstance for API call
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Could not fetch items from the API");
  }
};

export const getItemsById = async(id:number) => {
  try {
    const response = await axiosInstance.get(`/api/item/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error fetching items by id :", error);
    throw new Error("Could not fetch items from the API");
  }
}
