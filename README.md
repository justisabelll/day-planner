# day-planner

simple day planner

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

To deploy:

1. build the docker image with `docker build -t day-planner .`
2. run the docker image with `docker run -p 3000:3000 day-planner` to be sure it works

you can host wherever you like (execept serverless ofc), i chose [railway](https://railway.app?referralCode=2v3LQH)

todo:

- [ ] make sure it works offline
- [ ] add dark mode

- [ ] edit task text
- [ ] add very simple, non-invasive analytics
- [ ] add validation (https://elysiajs.com/validation/schema-type.html)
