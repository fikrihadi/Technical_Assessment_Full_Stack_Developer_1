import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';  
import sql from 'mssql';      
import itemRoute from "./routes/item.route";

dotenv.config();  
const app: Express = express();
const port = process.env.PORT || 3000;

//database credential
const sqlConfig = {
  server: process.env.DB_SERVER!, 
  user: process.env.DB_USERNAME,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
  },
};

// Global connection pool
export let pool: sql.ConnectionPool;

//connect to database
async function connectToDatabase() {
  try {
    pool = await sql.connect(sqlConfig);
    console.log('Connected to SQL Server successfully!');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error connecting to SQL Server:', err.message);
    } else {
      console.error('An unknown error occurred:', err);
    }
  }
}


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/item', itemRoute);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  await connectToDatabase(); 
});
