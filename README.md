# Mercurius

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Follow these steps to get the project up and running:

### 1. Clone the repository from GitHub

  Open your terminal and run one of the following commands to clone the repository:

  - Using SSH:
    `git clone git@github.com:mlaszewski/mercurius.git`

  - Using HTTPS:
    `git clone https://github.com/mlaszewski/mercurius.git`

### 2. Navigate to the project directory

The `git clone` command will create a new directory with the same name as the repository. Navigate into this directory with:
   ```bash
   cd mercurius
   ```

### 3. Install the dependencies You need to have Node.js and npm installed on your machine. Once you have them, you can install the project dependencies with:**
```bash
  npm install
```

### 4. Run the development server with:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

## 5. Open running project
Open your web browser and visit [http://localhost:3000](http://localhost:3000) to see the application running.

## Linting and Formatting
This project uses ESLint for linting and Prettier for code formatting. Before committing your changes, make sure to run the linter and formatter:

```bash
# Run ESLint
npm run lint

# Run Prettier
npm run prettier
```

We also use lint-staged to automatically fix any linting and formatting errors before each commit. This ensures that all committed code follows the same style guidelines.

## Tests

To execute backend unit tests, run:
```bash
npm run test
```

For end-to-end tests with Cypress in headed mode:

```bash
npm run cy:run
```

To open the Cypress dashboard, use this command:

```bash
npm run cy:open
```
