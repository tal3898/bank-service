import {Connection} from './dal/connection';
import express from 'express';
import bodyParser from 'body-parser';
import { NewTransaction } from './models/apiTypes/newTransaction';
import { TransactionManager } from './bl/transactionManager';
import { TransactionCollection } from './dal/transaction';

async function main() {
    const app = express();
    const port = 3000;

    app.use(bodyParser.json());

    const dbConnection = new Connection();
    await dbConnection.connect();
    const transactionCollection = new TransactionCollection(dbConnection);
    const transactionManager = new TransactionManager(transactionCollection);
    
    
    app.post('/performAdvance', async (req, res) => {
      const { sourceBank, destBank, amount } = req.body as NewTransaction;
      transactionManager.performAdvanceTransaction(sourceBank, destBank, amount);

      res.send(200);
    });
    
    
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });   
    
}

main();