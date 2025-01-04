
import axios from 'axios';
import { Item } from '../modal/Item'; 

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

export const updateItemById = async (id: number, item: Item) => {
  try {
    const response = await axiosInstance.put(`/api/item/${id}`, item); // Correct endpoint
    return response.data; // Return updated item data
  } catch (error) {
    // Narrow 'error' to have more meaningful handling
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update item");
    } else if (error instanceof Error) {
      console.error("General error:", error.message);
      throw new Error("An unexpected error occurred");
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
    }
  }
};

export const insertItem = async ( item: Item) => {
  try {
    const response = await axiosInstance.post('/api/item/', item); // Correct endpoint
    return response.data; // Return updated item data
  } catch (error) {
    // Narrow 'error' to have more meaningful handling
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to insert item");
    } else if (error instanceof Error) {
      console.error("General error:", error.message);
      throw new Error("An unexpected error occurred");
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
    }
  }
};


export const deleteItemsByid = async(id:number) => {
  try {
    const response = await axiosInstance.delete(`/api/item/${id}`)
    return response.data;
  } catch (error) {
    console.error("Error deleting items by id :", error);
    throw new Error("Could not deleting items from the API");
  }
}


