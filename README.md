# SQL Editor

## Installation

Clone the repository and create the `.env.development.local` file. It's okay to copy the `.env.example` and leave it as it is, unless the needed ports are already taken.

To start the application you can run

<pre>docker compose up</pre>

If you want to run it in the development mode, you need to set up the local database and update the `.env.development.local` file.

Once it's done, install the dependencies and run the application

<pre>
pnpm install
pnpm run start:dev
</pre>
