import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from "../../modal/Item";
import {
  getItems,
  getItemsById,
  insertItem,
  updateItemById,
  deleteItemsByid,
} from "../../api/itemAPI";

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  selectedItem: Item | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
};

// Async thunks
export const fetchItems = createAsyncThunk("items/fetchItems", async () => {
  return await getItems();
});

export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id: number) => {
    return await getItemsById(id);
  }
);

export const saveNewItem = createAsyncThunk(
  "items/saveNewItem",
  async (item: Item) => {
    return await insertItem(item);
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async (item: Item) => {
    return await updateItemById(item.id, item);
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: number) => {
    await deleteItemsByid(id);
    return id;
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch items.";
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
      })
      .addCase(saveNewItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { selectItem } = itemsSlice.actions;
export default itemsSlice.reducer;
