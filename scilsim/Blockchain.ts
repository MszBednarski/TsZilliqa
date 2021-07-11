import { Account } from "./Account";
import { ReceivedTransaction, WrappedTransaction } from "./Transaction";

export class Blockchain {
  private static accounts: { [key: string]: Account } = {};
  protected static addAccount(a: Account) {
    Blockchain.accounts[a._address] = a;
  }
  static send<T>(t: WrappedTransaction<T>) {
    if (t._amount < 0) {
      throw new Error(`Amount smaller than 0 ${t._amount}, ${t._sender}`);
    }
    //@ts-ignore
    if (typeof Blockchain.accounts[t._recipient][t._tag] != "function") {
      throw new Error(`${t._tag} is not a function in: ${t._recipient}`);
    }
    //@ts-ignore
    Blockchain.accounts[t._recipient][t._tag](t);
  }
  static accept(t: ReceivedTransaction) {
    const { _recipient, _sender, _amount } = t as WrappedTransaction;
    const _sender_balance = Blockchain.accounts[_sender]._balance;
    if (_sender_balance >= _amount) {
      Blockchain.accounts[_recipient]._balance =
        Blockchain.accounts[_recipient]._balance + _amount;
      Blockchain.accounts[_sender]._balance = _sender_balance - _amount;
      return;
    }
    throw new Error(
      `${_sender} Insufficient funds ${_sender_balance - _amount}`
    );
  }

  static emit<E extends { _eventname: string }>(t: ReceivedTransaction, e: E) {
    const tx = t as WrappedTransaction;
    console.log(`Event from ${tx._recipient}`);
    console.log(e);
  }
}
