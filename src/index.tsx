import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { tailwind } from '@gtramontina.com/elysia-tailwind';
import { rateLimit } from 'elysia-rate-limit';
import {
  BaseHTML,
  Header,
  TodoList,
  RateLimitHtml,
  validateHTML,
} from './components';
import type {
  Task,
  NewTaskRequestParams,
  DeleteTaskRequestParams,
  UpdateTaskRequestParams,
} from './misc/types';
import {
  initDB,
  addNewTask,
  getTasks,
  deleteTask,
  updateTask,
  toggleTask,
} from './misc/db';

initDB();
let tasks = getTasks();

const app = new Elysia()
  .use(
    tailwind({
      path: '/public/stylesheet.css',
      source: './src/styles.css',
      config: './tailwind.config.js',
      options: {
        minify: true,
        map: true,
        autoprefixer: false,
      },
    })
  )
  .use(html())
  .use(
    rateLimit({
      max: 500, // Maximum number of requests allowed per window
      duration: 3600000, // Duration of rate limit window in milliseconds (1 hour)
      errorResponse: new Response(validateHTML(RateLimitHtml), {
        status: 429,
        headers: {
          'Content-Type': 'text/html',
        },
      }),
    })
  )
  .get('/', ({ html }: { html: any }) =>
    html(
      <BaseHTML>
        <Header />
        <TodoList tasks={tasks} />
      </BaseHTML>
    )
  )
  .post('/newTask', ({ body }: { body: NewTaskRequestParams }) => {
    tasks = addNewTask(body.task);

    return <TodoList tasks={tasks} />;
  })
  .post(
    '/toggleTask/:id',
    ({
      params,
      query,
    }: {
      params: UpdateTaskRequestParams;
      query: { isDone: String };
    }) => {
      tasks = toggleTask(params.id, query.isDone === 'true');

      return <TodoList tasks={tasks} />;
    }
  )

  .delete(
    '/deleteTask/:id',
    ({ params }: { params: DeleteTaskRequestParams }) => {
      tasks = deleteTask(params.id);

      return <TodoList tasks={tasks} />;
    }
  )

  .get('/tasks', () => tasks)
  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
