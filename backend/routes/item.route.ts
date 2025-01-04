import {Router} from "express";
import {createItemController,getItemByIdController, getAllItemsController,updateItemController,deleteItemController}
from "../controllers/item.controller";

const router = Router();

// Define the routes and link to the controllers
router.post('/', createItemController);          // Create a new item
router.get('/', getAllItemsController);         // Get all items
router.get('/:id', getItemByIdController);     // Get item by id
router.put('/:id', updateItemController);     // Update item by id
router.delete('/:id', deleteItemController);     // delete item by id


export default router;