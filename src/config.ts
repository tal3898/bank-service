import dotenv from 'dotenv';
dotenv.config();

const config = {
    debitDays: +process.env.DEBIT_DAYS!,
    debitDaysInterval: +process.env.DEBIT_DAYS_INTERVAL!,
}

console.log({message: 'configured with', config})

export default config;