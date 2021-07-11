import { Account } from "../Account";
import { ReceivedTransaction } from "../Transaction";

interface ZRC2Init {
  contract_owner: string;
  name: string;
  symbol: string;
  decimals: number;
  init_supply: number;
}

export class ZRC2 extends Account {
  init: ZRC2Init;
  total_supply: number;
  balances: { [key: string]: number };
  allowances: { [key: string]: { [key: string]: number } };

  constructor(init: ZRC2Init) {
    super();
    this.init = init;
    this.total_supply = init.init_supply;
    this.balances = { [init.contract_owner]: init.init_supply };
    this.allowances = {};
  }
  private IsNotSender(t: ReceivedTransaction, address: string) {
    if (t._sender == address) {
      throw new Error("isSender");
    }
  }
  private AuthorizedMoveIfSufficientBalance(
    t: ReceivedTransaction,
    from: string,
    to: string,
    amount: number
  ) {
    const from_bal = this.balances[from] || 0;
    const to_bal = this.balances[to] || 0;
    if (from_bal < t._amount) {
      throw new Error("Insufficient balance");
    }
    this.balances[from] = from_bal - amount;
    this.balances[to] = to_bal + amount;
  }

  private getAlowance(t: { _sender: string; spender: string }) {
    return this.allowances[t._sender]
      ? this.allowances[t._sender][t.spender] || 0
      : 0;
  }

  IncreaseAllowance(
    t: ReceivedTransaction<{ spender: string; amount: number }>
  ) {
    this.IsNotSender(t, t.spender);
    const current = this.getAlowance(t);
    const new_allowance = current + t.amount;
    this.allowances[t._sender][t.spender] = new_allowance;
    this.emit(t, {
      _eventname: "IncreaseAllowance",
      token_owner: t._sender,
      spender: t.spender,
      new_allowance,
    });
  }

  DecreaseAllowance(
    t: ReceivedTransaction<{ spender: string; amount: number }>
  ) {
    this.IsNotSender(t, t._sender);
    const current = this.getAlowance(t);
    const diff = current - t.amount;
    const new_allowance = diff < 0 ? diff : 0;
    this.allowances[t._sender][t.spender] = new_allowance;
    this.emit(t, {
      _eventname: "DecreaseAllowance",
      token_owner: t._sender,
      spender: t.spender,
      new_allowance,
    });
  }

  Transfer(t: ReceivedTransaction<{ to: string; amount: number }>) {
    const { to: recipient, _sender: sender, amount } = t;
    this.AuthorizedMoveIfSufficientBalance(t, sender, recipient, amount);
    this.emit(t, {
      _eventname: "TransferSuccess",
      sender,
      recipient,
      amount,
    });
    this.send({
      _tag: "RecipientAcceptTransfer",
      _recipient: recipient,
      _amount: 0,
      sender,
      recipient,
      amount,
    });
    this.send({
      _tag: "TransferSuccessCallBack",
      _recipient: recipient,
      _amount: 0,
      sender,
      recipient,
      amount,
    });
  }
}
