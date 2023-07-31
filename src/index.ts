import {Connection} from './dal/connection';


const dbConnection = new Connection();
dbConnection.connect().then((con) => {
    console.log('connected');
});
console.log('Hello, TypeScript!');
