import { Account } from "./Account";
import { ReceivedTransaction, WrappedTransaction } from "./Transaction";

export class Blockchain {
  private static accounts: { [key: string]: Account } = {};
  protected static addAccount(a: Account) {
    Blockchain.accounts[a._address] = a;
  }
  static send(t: WrappedTransaction) {
    console.log(t);
    //@ts-ignore
    Blockchain.accounts[t._recipient][t.tag](t);
  }
  static accept(t: ReceivedTransaction) {
    const { _recipient, _sender, amount } = t as WrappedTransaction;
    const _sender_balance = Blockchain.accounts[_sender]._balance;
    if (_sender_balance >= amount) {
      Blockchain.accounts[_recipient]._balance =
        Blockchain.accounts[_recipient]._balance + amount;
      Blockchain.accounts[_sender]._balance = _sender_balance - amount;
      return;
    }
    throw new Error(`${_sender} Insufficient funds ${_sender_balance-amount}`);
  }
}
