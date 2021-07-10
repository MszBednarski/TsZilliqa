import { Account } from "./Account";

//given 2 accounts how do i make them interact by means of a transaction

const a1 = new Account({ _balance: 100 });
const a2 = new Account();

a1.send({ _recipient: a2._address, tag: "AddFunds", amount: 33 });

console.log(a1);
console.log(a2);
