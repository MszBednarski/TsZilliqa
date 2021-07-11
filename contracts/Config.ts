import { Account } from "../scilsim";

interface ConfigInit {
  admin: string;
  implementations: { [key: string]: string };
}

export class Config extends Account {
  init: ConfigInit;

  constructor(init: ConfigInit) {
    super();
    this.init = init;
  }
}
