export type Transaction = {
  tag: string;
  amount: number;
  _recipient: string;
};

export type WrappedTransaction = Transaction & {
  _sender: string;
};

export type ReceivedTransaction = { _sender: string; amount: number };
