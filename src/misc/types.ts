export interface Task {
  id: number;
  text: string;
  isDone: boolean;
  timeFinished: string;
}
export interface NewTaskRequestParams {
  task: string;
}

export interface DeleteTaskRequestParams {
  id: number;
}

export interface UpdateTaskRequestParams {
  id: number;
  text?: string;
  isDone?: boolean;
}

export class RateLimitError extends Error {
  constructor(
    public message: string = 'rate-limited',
    public detail: string = '',
    public status: number = 429
  ) {
    super(message);
  }
}
