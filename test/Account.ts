import { Account } from "../scilsim/Account";

//given 2 accounts how do i make them interact by means of a transaction

const Alice = new Account({ _balance: 100 });
const Bob = new Account();

Alice.send({
  _recipient: Bob._address,
  _amount: 33,
  _tag: "AddFunds",
});

console.log(Alice);
console.log(Bob);
