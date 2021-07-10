import { v4 } from "uuid";
import { Blockchain } from "./Blockchain";
import {
  WrappedTransaction,
  Transaction,
  ReceivedTransaction,
} from "./Transaction";
/**
 * base
 * every entity
 * extends account
 */
export class Account extends Blockchain {
  _balance: number;
  _address: string;

  constructor(init?: { _balance: number }) {
    super();
    this._balance = init ? init._balance : 0;
    this._address = v4();
    Blockchain.addAccount(this);
  }

  send(t: Transaction) {
    const tx: WrappedTransaction = { ...t, _sender: this._address };
    Blockchain.send(tx);
  }

  AddFunds(t: ReceivedTransaction) {
    Blockchain.accept(t);
  }
}
