import { v4 } from "uuid";
import { Blockchain } from "./Blockchain";

type MethodTagsOf<T, M extends keyof T> = T[M] extends (...args: any) => any
  ? M
  : never;

export class Contract {
  _balance: number;
  _address: string;
  _blockchain: Blockchain;
  _sender: string;

  constructor(b: Blockchain) {
    this._balance = 0;
    this._address = v4();
    this._blockchain = b;
    this._sender = "";
  }

  send<
    T extends Contract,
    SomeTag extends keyof T,
    Tag extends MethodTagsOf<T, SomeTag>,
    Data extends Parameters<T[Tag]>
  >(from: string, to: string, contract: T, tag: Tag, data: Data): void {
    this._sender = from;
    const ref = this._blockchain.getContract<T>(to);
    ref[tag](...data);
  }

  emit(event: { [key: string]: string }) {
    console.log(`Event from ${this._address}`);
    console.log(event);
  }

  read<T extends Contract>(address: string, contract: T): T {
    return this._blockchain.getContract<T>(address);
  }
}
