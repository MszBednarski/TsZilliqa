import { Account, Blockchain, ReceivedTransaction } from "../scilsim";
import { Config } from "./Config";

interface IgniteWalletInit {
  admin: string;
  services_addr: string;
  service_accounts: { [key: string]: string };
}

export class IgniteWallet extends Account {
  init: IgniteWalletInit;
  contract_admin: string;
  void_cheques: { [key: string]: string };

  constructor(init: IgniteWalletInit) {
    super();
    this.init = init;
    this.contract_admin = init.admin;
    this.void_cheques = {};
  }

  private IsAdmin(t: ReceivedTransaction) {
    if (t._sender != this.contract_admin) {
      throw new Error(`${t._sender} is not contract admin`);
    }
  }
  private IsAdminOrServiceAccount(t: ReceivedTransaction, tag: string) {
    if (
      t._sender == this.contract_admin ||
      t._sender == this.init.service_accounts[tag]
    ) {
      return;
    }
    throw new Error("Is not authorized");
  }
  // The ZIL send
  SendFunds(t: ReceivedTransaction<{ tag: string; beneficiary: string }>) {
    this.IsAdmin(t);
    Blockchain.accept(t);
    this.send({ _tag: t.tag, _recipient: t.beneficiary, _amount: t._amount });
  }
  // The Token transition
  Transfer(
    t: ReceivedTransaction<{
      addrName: string;
      beneficiary: string;
      amount: number;
    }>
  ) {
    this.IsAdmin(t);
    const tokenAddr = Blockchain.fetch<Config>(this.init.services_addr).init
      .implementations[t.addrName];
    this.send({
      _tag: "Transfer",
      _recipient: tokenAddr,
      _amount: 0,
      to: t.beneficiary,
      amount: t.amount,
    });
  }
  WithdrawStakeRewards(
    t: ReceivedTransaction<{ ssnProxyName: string; ssnaddr: string }>
  ) {
    this.IsAdminOrServiceAccount(t, "WithdrawStakeRewards");
    const proxy = Blockchain.fetch<Config>(this.init.services_addr).init
      .implementations[t.ssnProxyName];
    this.send({
      _tag: "WithdrawStakeRewards",
      _recipient: proxy,
      _amount: 0,
      ssnaddr: t.ssnaddr,
    });
  }
  DelegateStake(
    t: ReceivedTransaction<{
      ssnProxyName: string;
      ssnaddr: string;
      amt: number;
    }>
  ) {
    this.IsAdminOrServiceAccount(t, "DelegateStake");
    const proxy = Blockchain.fetch<Config>(this.init.services_addr).init
      .implementations[t.ssnProxyName];
    this.send({
      _tag: "DelegateStake",
      _recipient: proxy,
      _amount: t.amt,
      ssnaddr: t.ssnaddr,
    });
  }
}
