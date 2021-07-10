import { Blockchain, Contract } from "../scilsim1";

interface ZRC2Init {
  contract_owner: string;
  name: string;
  symbol: string;
  decimals: number;
  init_supply: number;
}

export class ZRC2 extends Contract {
  init: ZRC2Init;
  total_supply: number;
  balances: { [key: string]: number };
  allowances: { [key: string]: { [key: string]: number } };

  constructor(init: ZRC2Init, blockchain: Blockchain) {
    super(blockchain);
    this.init = init;
    this.total_supply = init.init_supply;
    this.balances = { [init.contract_owner]: init.init_supply };
    this.allowances = {};
  }

  private isNotSender(address: string) {
    if (this._sender == address) {
      throw new Error("isSender");
    }
  }
  private authorizedMoveIfSufficientBalance(
    from: string,
    to: string,
    amount: number
  ) {}
}
