import { Account } from "../scilsim/Account";
import { ZRC2 } from "../contracts/ZRC2";
import { log } from "../scilsim/util";

const Alice = new Account({ address: "Alice" });
const Bob = new Account({ address: "Bob" });
const Josh = new Account({ address: "Josh" });

const oxygen = new ZRC2({
  name: "Oxygen",
  contract_owner: Alice._address,
  decimals: 18,
  init_supply: 1000,
  symbol: "OX",
});

Alice.send({
  _recipient: oxygen._address,
  _amount: 0,
  _tag: "Transfer",
  to: Bob._address,
  amount: 150,
});

Alice.send({
  _recipient: oxygen._address,
  _amount: 0,
  _tag: "IncreaseAllowance",
  spender: Josh._address,
  amount: 420,
});

Josh.send({
  _recipient: oxygen._address,
  _amount: 0,
  _tag: "TransferFrom",
  from: Alice._address,
  to: Bob._address,
  amount: 320,
});

Alice.send({
  _recipient: oxygen._address,
  _amount: 0,
  _tag: "DecreaseAllowance",
  spender: Josh._address,
  amount: 1000,
});

log({ oxygen });
