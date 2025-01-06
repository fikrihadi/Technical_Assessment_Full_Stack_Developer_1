// item.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as itemService from '../services/item.service';
import { validateItemInput } from '../validation/items.validation';
import { z } from 'zod';  

// Create a new item
export const createItemController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { name, description, price } = req.body;
  // Call the validation function
  const validationResult = validateItemInput(name, description, price);

  if (validationResult && !validationResult.valid) {
    // If validation failed, send a response with the validation errors
    res.status(400).json({
      success: false,
      message: 'item insertion failed',
      errors: validationResult.errors
    });
    return; // Prevent further execution
  }

  try {
    const item = await itemService.createItem(name, description, price);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// Get all items
export const getAllItemsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

// Get an item by id
export const getItemByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const item = await itemService.getItemById(Number(id));
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    next(err);
  }
};

// Update an item by id
export const updateItemController = async (req: Request, res: Response, next: NextFunction) => {
  
  const { id } = req.params;
  const { name, description, price } = req.body;

  const validationResult = validateItemInput(name, description, price);

  if (validationResult && !validationResult.valid) {
    // If validation failed, send a response with the validation errors
    res.status(400).json({
      success: false,
      message: 'item update failed',
      errors: validationResult.errors
    });
    return; // Prevent further execution
  }


  try {
    const updatedItem = await itemService.updateItem(Number(id), name, description, price);
    res.status(200).json(updatedItem);
  } catch (err) {
    next(err);
  }
};

// Delete an item by id
export const deleteItemController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const deletedItem = await itemService.deleteItem(Number(id));
    res.status(200).json(deletedItem);
  } catch (err) {
    next(err);
  }
};
