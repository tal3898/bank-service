import { abort } from "process";
import { TransactionCollection } from "../dal/transaction";
import { Processor } from "./processor";
import { Transaction } from "../models/transaction";
import { Status } from "../models/status";
import { Report } from "../models/report";

const DEBIT_DAYS = 12;
const DEBIT_DAYS_INTERVAL = 7;

export class TransactionManager {
    private processor: Processor;

    constructor(private transactionCollection: TransactionCollection) {
        this.processor = new Processor();
    }

    performAdvanceTransaction( sourceBank: string, destBank: string, amount: number ) {
        const transactionId = this.processor.perform_transaction(sourceBank, destBank, amount/DEBIT_DAYS, 'debit');
        const transactionReports = this.processor.download_report();
        const currTransactionReport = transactionReports.find((currReport) => currReport.transactionId === transactionId);

        if (currTransactionReport === undefined) {
            throw new Error('Transaction ' + transactionId + ' was not processed.')
        }

        this.handleTransaction(transactionId, sourceBank, destBank, amount, currTransactionReport);
    }

    private handleTransaction(transactionId:string, sourceBank:string, destBank: string, amount:number, transactionReport: Report) {
        let daysPaid = 1;
        if (transactionReport.status === Status.FAILED) {
            daysPaid = 0;
        }

        const nextDateToPay = new Date();
        nextDateToPay.setDate(nextDateToPay.getDate() + DEBIT_DAYS_INTERVAL);
        nextDateToPay.setHours(0, 0, 0, 0);

        const newTransactionToSave: Transaction = {
            amount,
            sourceBank,
            destBank,
            daysPaid: daysPaid,
            daysToDebit: DEBIT_DAYS,
            nextDateToPay: nextDateToPay
        }

        this.transactionCollection.insertTransaction(newTransactionToSave);
    }
}