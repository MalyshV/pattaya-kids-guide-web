export type ApiSuccess<T> = {
  data: T;
  meta?: {
    total?: number;
  };
};

export type ApiError = {
  error: {
    message: string;
    code?: string;
  };
};
