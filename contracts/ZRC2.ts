import { Account, ReceivedTransaction } from "../scilsim";

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
    from: string,
    to: string,
    amount: number
  ) {
    const from_bal = this.balances[from] || 0;
    const to_bal = this.balances[to] || 0;
    if (from_bal < amount) {
      throw new Error("Insufficient balance: " + from);
    }
    this.balances[from] = from_bal - amount;
    this.balances[to] = to_bal + amount;
  }

  private getAlowance(owner: string, spender: string) {
    if (!this.allowances[owner]) {
      this.allowances[owner] = {};
    }
    return this.allowances[owner] ? this.allowances[owner][spender] || 0 : 0;
  }

  IncreaseAllowance(
    t: ReceivedTransaction<{ spender: string; amount: number }>
  ) {
    this.IsNotSender(t, t.spender);
    const current = this.getAlowance(t._sender, t.spender);
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
    this.IsNotSender(t, t.spender);
    const current = this.getAlowance(t._sender, t.spender);
    const diff = current - t.amount;
    const new_allowance = diff < 0 ? 0 : diff;
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
    this.AuthorizedMoveIfSufficientBalance(sender, recipient, amount);
    const event = { sender, recipient, amount };
    this.emit(t, {
      _eventname: "TransferSuccess",
      ...event,
    });
    const msg = {
      _recipient: recipient,
      _amount: 0,
      ...event,
    };
    this.send({
      _tag: "RecipientAcceptTransfer",
      ...msg,
    });
    this.send({
      _tag: "TransferSuccessCallBack",
      ...msg,
    });
  }

  TransferFrom(
    t: ReceivedTransaction<{ from: string; to: string; amount: number }>
  ) {
    const allowance = this.getAlowance(t.from, t._sender);
    if (allowance < t.amount) {
      throw new Error("Allowance not sufficient");
    }
    this.AuthorizedMoveIfSufficientBalance(t.from, t.to, t.amount);
    const event = {
      initiator: t._sender,
      sender: t.from,
      recipient: t.to,
      amount: t.amount,
    };
    this.emit(t, {
      _eventname: "TransferFromSuccess",
      ...event,
    });
    const new_allowance = allowance - t.amount;
    this.allowances[t.from][t._sender] = new_allowance;
    const msg = {
      _recipient: t.to,
      _amount: 0,
      ...event,
    };
    this.send({
      ...msg,
      _tag: "RecipientAcceptTransferFrom",
    });
    this.send({
      ...msg,
      _tag: "TransferFromSuccessCallBack",
    });
  }
}
