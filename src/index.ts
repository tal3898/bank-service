import {Connection} from './dal/connection';
import express from 'express';
import bodyParser from 'body-parser';
import { NewTransaction } from './models/apiTypes/newTransaction';
import config from './config'

async function main() {
    const app = express();
    const port = 3000;

    console.log(config)


    app.use(bodyParser.json());

    const dbConnection = new Connection();
    await dbConnection.connect();
    
    app.post('/performAdvance', async (req, res) => {
      const { sourceBank, destBank, amount } = req.body as NewTransaction;
    
      console.log({sourceBank, destBank, amount})
      res.send(200);
    });
    
    
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });   
    
}

main();