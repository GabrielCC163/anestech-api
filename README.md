docker-compose up

tasks (description, user, status (OPEN, IN_PROGRESS, DONE), started_at, ended_at, created_at)

    crud
        read filter: description, status[]
        read order: user, status, created_at
    checkin
    checkout

roles

    admin
        can: crud users, read indications, crud tasks

    agent
        can: create and update tasks

users (name, email, role, \*password)

    crud (only by users)
        inserted: superadmin*

indicators

    filters: dt_start, dt_end
    -> number of ended tasks
    -> avg of tasks ended by user
    -> avg time spent between OPEN and DOING of tasks
    -> avg time spent between DOING and DONE of tasks.

# Anestech - Task Management API

### Local requirements

- Node.js, Yarn, Docker, Docker Compose

### Initialization

- Clone the repository and install the dependencies:

  ```bash
    $ git clone
    $ cd anestech-api
    $ yarn install
  ```

- Start the database:

  ```bash
    $ docker-compose up -d
  ```

- Execute the migrations for creating the users and tasks tables.
  ```bash
  $ yarn sequelize db:migrate
  ```
- Execute the seeder for creating a **ADMIN USER**:

  ```bash
    $ yarn sequelize db:seed:all
  ```

- Start the API
  ```bash
  $ yarn start
  ```
