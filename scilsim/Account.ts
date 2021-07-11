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

  constructor(init?: { _balance?: number; address?: string }) {
    super();
    this._balance = init ? (init._balance ? init._balance : 0) : 0;
    this._address = init ? (init.address ? init.address : v4()) : v4();
    Blockchain.addAccount(this);
  }

  send<T extends {}>(t: Transaction<T>) {
    const tx: WrappedTransaction<T> = { ...t, _sender: this._address };
    Blockchain.send(tx);
  }

  emit<E extends { _eventname: string }>(t: ReceivedTransaction, e: E) {
    Blockchain.emit(t, e);
  }

  AddFunds(t: ReceivedTransaction) {
    Blockchain.accept(t);
    Blockchain.emit(t, { _eventname: "AddFunds", amount: t._amount });
  }

  RecipientAcceptTransfer(t: ReceivedTransaction) {}
  TransferSuccessCallBack(t: ReceivedTransaction) {}
  RecipientAcceptTransferFrom(t: ReceivedTransaction) {}
  TransferFromSuccessCallBack(t: ReceivedTransaction) {}
}
