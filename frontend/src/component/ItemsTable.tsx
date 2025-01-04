import React, { useEffect, useState } from "react";
import { getItems, getItemsById } from "../api/itemAPI";
import { Item } from "../modal/Item";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon

const ItemsTable: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [open, setOpen] = useState(false); // This state controls whether the modal is open

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleRowClick = async (item: Item) => {
    try {
      setLoading(true);

      const fetchedItem = await getItemsById(item.id);
      setSelectedItem(fetchedItem);
      setOpen(true); // Open the modal
    } catch (error) {
      console.error("Failed to fetch item details:", error);
      setError("Failed to fetch item details");
    } finally {
      setLoading(false); // End the loading state
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleAddNewItem = () => {
    setSelectedItem(null);
    setOpen(true);
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-200">
      {/* Add New Item Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewItem}
        sx={{ marginBottom: 2 }}
      >
        Add New Item
      </Button>

      <div className="w-full max-w-4xl">
        <table className="w-full border border-gray-400 bg-white text-sm bg-red-200">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="px-4 py-2 border border-gray-400 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-400 text-left">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-400 text-left">
                Description
              </th>
              <th className="px-4 py-2 border border-gray-400 text-right">
                Price (RM)
              </th>
              <th className="px-4 py-2 border border-gray-400 text-left">
                Created At
              </th>
              <th className="px-4 py-2 border border-gray-400 text-left">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? "bg-red-100" : "bg-red-50"
                } hover:bg-red-300 cursor-pointer`}
                onClick={() => handleRowClick(item)}
              >
                <td className="px-4 py-2 border border-gray-400">{item.id}</td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.name}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.description}
                </td>
                <td className="px-4 py-2 border border-gray-400 text-right">
                  RM{item.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-box">
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Item Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Name:</strong> {selectedItem?.name}
          </Typography>
          <Typography>
            <strong>Description:</strong> {selectedItem?.description}
          </Typography>
          <Typography>
            <strong>Price (RM):</strong> RM{selectedItem?.price.toFixed(2)}
          </Typography>
          <Typography>
            <strong>Created At:</strong>{" "}
            {selectedItem?.createdAt
              ? new Date(selectedItem.createdAt).toLocaleString()
              : "N/A"}
          </Typography>
          <Typography>
            <strong>Updated At:</strong>{" "}
            {selectedItem?.updatedAt
              ? new Date(selectedItem.updatedAt).toLocaleString()
              : "N/A"}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ItemsTable;
