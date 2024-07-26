# OutReachKenya

OutReachKenya is an open-source web application aimed at empowering Kenyans to report human rights violations and other grievances to government bodies, international organizations, and human rights organizations. This project provides a streamlined platform for users to create and send emails, ensuring their voices are heard.

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
  - [Server](#server)
  - [Client](#client)
- [Deployment](#deployment)
  - [DIY](#diy)
- [Styling](#styling)
- [Contributing](#contributing)
- [Terms of Use](#terms-of-use)

## Getting Started

This project is a monorepo containing both the server and client applications. To get started, clone the repository and follow the instructions for the server and client applications.

## Development

### Server

The server is built using Elysia with the Bun runtime.

To start the development server, run:

```bash
bun run dev
```

### Client

The client is built using Remix.

To start the development server, run:

```bash
bun run dev
```

## Deployment

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready. Make sure to deploy the output of `npm run build`.

- build/server
- build/client

To build your app for production, run:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Contributing

We welcome contributions to OutReachKenya! Here’s how you can get started:

1. Fork the repository: Click the "Fork" button at the top right of this page to create a copy of this repository in your GitHub account.
2. Clone your fork: Clone your forked repository to your local machine.

```sh
git clone https://github.com/your-username/outreach-kenya.git
```

3. Create a branch: Create a new branch for your feature or bugfix.

```sh
git commit -m "Description of your changes"
```

4. Make your changes: Make your changes to the codebase.
5. Commit your changes: Commit your changes with a clear message.

```sh
git commit -m "Description of your changes"
```

6. Push to your fork: Push your changes to your forked repository.

```sh
git push origin my-feature-branch
```

7. Create a pull request: Go to the original repository and create a new pull request from your fork.

#### Feel free to contribute and help improve OutReachKenya! If you have any questions or need assistance, please open an issue.
