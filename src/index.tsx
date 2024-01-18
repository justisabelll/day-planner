import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { tailwind } from 'elysia-tailwind'; // 1. Import

const BaseHTML = ({
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
}) => `

<!DOCTYPE html>
   <html lang="en">
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
        <link href="/public/stylesheet.css" rel="stylesheet">

    <title>simple planner</title>
  </head>
  <body >
    <div  id="root">${children}</div>
  </body>
</html>
`;

const app = new Elysia()
  .use(
    tailwind({
      // 2. Use
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
  .get('/', ({ html }) =>
    html(
      <BaseHTML>
        <div class="flex items-center justify-center h-screen">
          <h1 class="text-violet-600 text-3xl font-bold underline mx-auto text-center">
            Hello World
          </h1>
        </div>
      </BaseHTML>
    )
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
