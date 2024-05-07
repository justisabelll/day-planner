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
      // 2.0 Use the tailwind plugin;
      path: '/public/stylesheet.css', // 2.1 Where to serve the compiled stylesheet;
      source: './src/styles.css', // 2.2 Specify source file path (where your @tailwind directives are);
      config: './tailwind.config.js', // 2.3 Specify config file path or Config object;
      options: {
        // 2.4 Optionally Specify options:
        minify: true, // 2.4.1 Minify the output stylesheet (default: NODE_ENV === "production");
        map: true, // 2.4.2 Generate source map (default: NODE_ENV !== "production");
        autoprefixer: false, // 2.4.3 Whether to use autoprefixer;
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
  .listen(Number(process.env.PORT) || 3000, () => {
    console.log(
      `🦊 Elysia is running at http://0.0.0.0:${process.env.PORT || 3000}`
    );
  });
