# Graphql

I chose a Postgres server for this project. I chose NOT to use an ORM. This can be debated: there are good reasons to choose an ORM, and there are good reasons not to. :)

## Requirements

* Node.js - at least version 20
* Docker
* Yarn

## How to run

### Install
  
```bash
yarn
```

### Start database and seed data

```bash
yarn pg:start
yarn pg:import-data
```

### Start Graphql server
  
```bash
yarn dev
```

### Test it
If you have the "REST Client" extentions for VSCode, you can use the `requests.http` file to test the server.

## Possible next steps, in no particular order

1. Add the bulk update task.
2. Add tests.
3. The SQL code always loads all columns from the tables, and Apollo takes care of chosing what to return. A possible (but possibly pre-mature) optimization would be to only load the columns that are actually used in the query.
4. Consider using an ORM like Prisma or TypeORM. Debatable...
5. Logging and monitoring.
6. Authentication, CORS-headers, etc.
7. Error handling middleware (for example so that SQL errors are not returned to the client).
8. If project grows, consider splitting the schema into multiple files.
9. Add a linter and a formatter.
