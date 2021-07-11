export type Transaction<T = {}> = {
  _tag: string;
  _amount: number;
  _recipient: string;
} & T;

export type WrappedTransaction<T = {}> = Transaction<T> & {
  _sender: string;
};

export type ReceivedTransaction<Params extends {} = {}> = {
  _sender: string;
  _amount: number;
} & Params;
