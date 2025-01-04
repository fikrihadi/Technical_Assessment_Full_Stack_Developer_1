// item.service.ts
import { pool } from '../app';  // Import the global pool for database connection
import sql from 'mssql'; 

export const createItem = async (name: string, description: string, price: number) => {
  const query = `
    INSERT INTO items (name, description, price) 
    VALUES (@name, @description, @price);
  `;
  
  try {
    if (!pool) {
      throw new Error('Database connection is not established');
    }

    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('price', sql.Decimal, price)
      .query(query);

    return { name, description, price };  // Return the item data as confirmation
  } catch (error) {
    console.error('Error creating item:', error);
    throw new Error('Could not create item');
  }
};

// Get all items
export const getAllItems = async () => {
  const query = 'SELECT * FROM items';

  try {
    if (!pool) {
      throw new Error('Database connection is not established');
    }

    const result = await pool.request().query(query);
    return result.recordset;  // Return the result as an array of items
  } catch (error) {
    console.error('Error fetching items:', error);
    throw new Error('Could not fetch items');
  }
};

// Get an item by ID
export const getItemById = async (id: number) => {
  const query = 'SELECT * FROM items WHERE id = @id';

  try {
    if (!pool) {
      throw new Error('Database connection is not established');
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(query);

    return result.recordset[0];  // Return the item if found, else null
  } catch (error) {
    console.error('Error fetching item:', error);
    throw new Error('Could not fetch item');
  }
};

// Update an item by ID
export const updateItem = async (id: number, name: string, description: string, price: number) => {
  const query = `
    UPDATE items 
    SET name = @name, description = @description, price = @price,
    updatedAt = GETDATE() 
    WHERE id = @id
  `;

  try {
    if (!pool) {
      throw new Error('Database connection is not established');
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('price', sql.Decimal, price)
      .query(query);

    return { id, name, description, price };  // Return updated item details
  } catch (error) {
    console.error('Error updating item:', error);
    throw new Error('Could not update item');
  }
};

// Delete an item by ID
export const deleteItem = async (id: number) => {
  const query = 'DELETE FROM items WHERE id = @id';

  try {
    if (!pool) {
      throw new Error('Database connection is not established');
    }

    await pool.request().input('id', sql.Int, id).query(query);

    return { id };  // Return the deleted item ID for confirmation
  } catch (error) {
    console.error('Error deleting item:', error);
    throw new Error('Could not delete item');
  }
};
