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

    crud (only by admin users)
        inserted: superadmin*

indicators

    filters: dt_start, dt_end
    -> number of ended tasks
       -> 50
    -> avg of tasks ended by user
       -> userX, avg
       -> userY, avg
       ...
    -> avg time spent between OPEN and DOING of tasks
       -> taskX, avg
       -> taskY, avg
       ...
    -> avg time spent between DOING and DONE of tasks.
       -> taskX, avg
       -> taskY, avg
       ...

# Anestech - Task Management API

## Local requirements

- Node.js, Yarn, Docker, Docker Compose

## Initialization

- Clone the repository, install the dependencies and set up .env file:

  ```bash
    $ git clone
    $ cd anestech-api
    $ yarn install
    $ mv .env-sample .env
  ```

- Start the database:

  ```bash
    $ docker-compose up -d
  ```

- Execute the migrations for creating the users and tasks tables.
  ```bash
  $ yarn sequelize db:migrate
  ```
- Execute the seeder for creating an **ADMIN USER**:

  ```bash
    $ yarn sequelize db:seed:all
  ```

- Start the API
  ```bash
  $ yarn start
  ```

### **REQUESTS DETAILED EXAMPLES**

### Auth

### Users

### Tasks

#### **<u>Index :: /tasks</u>**

**<i>Query params:</i>**

- **Filter examples:**

  **Name:** description | **Value:** learn node \
   Returns every task that **contains** "study node" in its description.

  **Name:** status | **Value:** OPEN,IN_PROGRESS \
  Returns every task that either has "OPEN" **or** "IN_PROGRESS" status.

- **Ordering examples:**

  **Name:** order | **Value:** -created_at \
   Returns tasks in **descending** order by "created_at" (notice the **"-"** sign before).

  **Name:** order | **Value:** -user.created_at,user.name \
  Returns tasks in **descending** order by "user.created_at" and **ascending** order by user.name, as long as the task is linked to a user.
