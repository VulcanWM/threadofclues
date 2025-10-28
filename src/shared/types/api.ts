export type InitResponse = {
  type: 'init';
  postId: string;
  xp: number;
  username: string;
  fragment: number;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};
