import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import {
  fetchItems,
  fetchItemById,
  saveNewItem,
  updateItem,
  deleteItem,
  selectItem,
} from "../features/items/itemsSlice";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Input,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Item } from "../modal/Item";

const ItemsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, selectedItem } = useSelector(
    (state: RootState) => state.items
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleRowClick = (item: Item) => {
    dispatch(fetchItemById(item.id));
    setOpen(true);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^\d.]/g, ""); // Remove non-numeric characters
    if (value === "" || isNaN(parseFloat(value)) || parseFloat(value) < 0) {
      value = "0.00"; // Default to 0.00 if invalid
    }
    const numericValue = parseFloat(value);
    if (selectedItem) {
      dispatch(selectItem({ ...selectedItem, price: numericValue }));
    }
  };

  const handleSaveNewItem = () => {
    if (selectedItem) {
      dispatch(saveNewItem(selectedItem));
      setOpen(false);
    }
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      const updatedItem = {
        ...selectedItem,
        createdAt: selectedItem.createdAt, // Ensure 'createdAt' is not overwritten
      };

      dispatch(updateItem(updatedItem));
      setOpen(false);
    }
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      dispatch(deleteItem(selectedItem.id));
      setOpen(false);
    }
  };

  const handleAddNewItem = () => {
    dispatch(
      selectItem({
        id: 0,
        name: "",
        description: "",
        price: 0.0,
        createdAt: "",
        updatedAt: "",
      })
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString)
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .replace(",", "")
      .replace(":", ".");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Button
        onClick={handleAddNewItem}
        variant="contained" // Primary button style
        color="primary" // Primary color theme
        sx={{ marginBottom: 2 }} // Optional margin for spacing
      >
        Add New Item
      </Button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Create Date</th>
            <th>Update Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} onClick={() => handleRowClick(item)}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{formatDateTime(item.createdAt)}</td>
              <td>{formatDateTime(item.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Item Details
          </Typography>

          <Input
            value={selectedItem?.name || ""}
            onChange={(e) =>
              dispatch(selectItem({ ...selectedItem!, name: e.target.value }))
            }
            fullWidth
            placeholder="Enter item name"
            sx={{ marginBottom: 2 }}
          />
          <Input
            value={selectedItem?.description || ""}
            onChange={(e) =>
              dispatch(
                selectItem({ ...selectedItem!, description: e.target.value })
              )
            }
            fullWidth
            placeholder="Enter item description"
            sx={{ marginBottom: 2 }}
          />
          <Input
            value={selectedItem?.price.toFixed(2) || ""}
            onChange={handlePriceChange}
            fullWidth
            placeholder="Enter item price"
            sx={{ marginBottom: 2 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {selectedItem && selectedItem.id === 0 ? (
              <Button variant="contained" onClick={handleSaveNewItem}>
                Save
              </Button>
            ) : (
              <Button variant="contained" onClick={handleUpdateItem}>
                Update
              </Button>
            )}
            {selectedItem && selectedItem.id !== 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteItem}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ItemsTable;
