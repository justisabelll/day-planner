import isHtml from 'is-html';

import type {
  Task,
  NewTaskRequestParams,
  DeleteTaskRequestParams,
} from './misc/types';

export const RateLimitHtml = `
  <h1 class="text-xl text-red-600">
    You're doing a lot right now. Try again later.
  </h1>
`;

// use this for the RateLimitHtml, will not not check for erronouse chars, but gaurentees valid html
export const validateHTML = (str: string): string => {
  if (isHtml(str)) {
    return str;
  } else {
    throw new Error('Invalid HTML content.');
  }
};

const today = new Date();

export const BaseHTML = ({
  children,
}: {
  children:
    | JSX.Element
    | JSX.Element[]
    | string
    | number
    | boolean
    | null
    | undefined;
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <link href="/public/stylesheet.css" rel="stylesheet" />
        <script src="https://unpkg.com/htmx.org@1.9.12" />
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js" />
        <title>simple planner</title>
      </head>
      <body>
        <div id="root">
          {children}
          <div class=""></div>
        </div>
      </body>
    </html>
  );
};

export const Header = () => {
  return (
    <header class="flex justify-between p-4 border-b border-gray-200">
      <div class="flex items-center">
        <h1 class="text-4xl">Day Planner</h1>
        <h2 class="ml-2 text-xl">&mdash; a simple tool to plan your day.</h2>
      </div>
      <div>
        <h3 class="pt-1 text-xl text-blue-600">{today.toLocaleDateString()}</h3>
      </div>
    </header>
  );
};

export const TodoList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div class="" id="todo-list-and-form" hx-ext="response-targets">
      <div class="flex flex-col h-[90vh]">
        <div class="flex overflow-auto flex-col flex-grow gap-2 p-4">
          {tasks.map((task) => (
            <TodoItem task={task} />
          ))}
        </div>
        <div class="flex justify-center items-center p-4 w-full border-t border-gray-200">
          <div class="w-full">
            <label for="task">New Task</label>
            <form
              hx-post="/newTask"
              hx-target="#todo-list-and-form"
              hx-target-429="#rate-limit-alert"
            >
              <div class="space-y-1">
                <input
                  class="p-2 w-full rounded-lg border border-gray-200"
                  type="text"
                  name="task"
                />
                <div class="flex justify-between items-center">
                  <p class="text-xs">Press enter to add.</p>
                  <p class="text-xs text-blue-600">
                    Scroll down if you can't see all your tasks.
                  </p>
                </div>
              </div>
            </form>
            <div
              id="rate-limit-alert"
              class="flex justify-center items-center h-fit-content"
            >
              <h1 class="text-4xl text-red-600"></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TodoItem = ({ task }: { task: Task }) => {
  return (
    <div
      class="justify-between p-4 rounded-lg border border-gray-200 md:flex-row"
      hx-ext="response-targets"
    >
      <div class="flex flex-1 justify-between">
        <div>
          <h3
            class={`text-2xl ${task.isDone ? 'line-through' : ''} break-word`}
          >
            {task.text}
          </h3>
          <label class="flex items-center">
            Done? &nbsp;
            <input
              type="checkbox"
              hx-post={`/toggleTask/${task.id}?isDone=${!task.isDone}`}
              hx-target="#todo-list-and-form"
              name="isDone"
              checked={task.isDone ? true : false}
            />
          </label>
        </div>
        <div>
          <button
            class="p-2 text-white bg-red-600 rounded-lg ring-1 ring-gray-200 shadow-md hover:bg-red-500"
            hx-delete={`/deleteTask/${task.id}`}
            hx-target="#todo-list-and-form"
            hx-target-429="#rate-limit-alert"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
