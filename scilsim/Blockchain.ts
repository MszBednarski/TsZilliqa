import { Contract } from "./Contract";

/**
 * Implements the blockchain characteristics relevant in
 * smart contract execution context
 */
export class Blockchain {
  blockNumber = 1;
  balances: { [address: string]: number } = {};
  contracts: { [address: string]: Contract } = {};

  /**
   * Simulates the blockchain finalizing another block
   */
  nextBlock() {
    this.blockNumber++;
  }

  /**
   * Lets you access a contract from within other contract
   */
  getContract<T extends Contract>(address: string): T {
    if (!this.contracts[address]) {
      throw new Error(`No contract with address: ${address}`);
    }
    return this.contracts[address] as T;
  }

  /**
   * Deploys a contract on the blockchain!
   */
  deploy<T extends Contract>(contract: T) {
    this.contracts[contract._address] = contract;
  }
}
