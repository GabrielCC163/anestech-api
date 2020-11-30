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
    $ git clone https://github.com/GabrielCC163/anestech-api.git
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

- Starts the API on **localhost:3333**
  ```bash
    $ yarn start
  ```

### **REQUESTS DETAILED EXAMPLES**

<hr>

### Auth

#### **<u>Register :: POST /signup</u>** - Creates a user

- admin role: can do all operations
- agent role: can only create, list and update tasks.

Body param example ("role" accepts "agent" and "admin"):

```json
{
  "name": "Gabriel Brum",
  "email": "gbrum@gmail.com",
  "password": "123456",
  "role": "agent"
}
```

Returns new user information and the TOKEN **(use it as Bearer token over all following requests)**.

#### **<u>Login :: POST /signin</u>** - Login a user **(REQUIRED)**

Body param example (admin user info):

```json
{
  "email": "admin@admin.com",
  "password": "123456"
}
```

Returns user information and the TOKEN **(use it as Bearer token over all following requests)**.

<hr>

### Users

#### **<u>Index :: GET /users</u>** - Returns all registered users.

#### **<u>Show :: GET /users/:user_id</u>** - Returns all data for a specific user.

#### **<u>Tasks :: GET /users/:user_id/tasks</u>** - Returns all user tasks

#### **<u>Update :: PUT /users/:user_id</u>** - Updates user name, email, role and password.

#### **<u>Remove :: DELETE /users/:user_id</u>** - Remove a user

<hr>

### Tasks

#### **<u>Create :: POST /tasks</u>** - Creates a task with status OPEN, without user_id, started_at and ended_at

Body param example:

```JSON
{
  "description": "create api with sequelize"
}
```

#### **<u>Index :: GET /tasks</u>** - Returns all tasks

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

#### **<u>Show :: GET /tasks/:task_id </u>** - Returns all data for a specific task.

#### **<u>Update :: PUT /tasks/:task_id </u>** - Updates task description, status, user_id, started_at and ended_at

Body param example:

```JSON
{
  "description": "create api with postgresql"
}
```

#### **<u>Check-in :: PATCH /tasks/:task_id/checkin</u>** - Assigns a user to a task and initializes it (user_id must be the same as the logged user id). Sets the status to IN_PROGRESS.

Body param example:

```JSON
{
  "user_id": "1"
}
```

#### **<u>Check-out :: PATCH /tasks/:task_id/checkout</u>** - Ends a task (user_id must be the same as the logged user id). Sets the status to DONE.

Body param example:

```JSON
{
  "user_id": "1"
}
```

#### **<u>Remove :: DELETE /tasks/:task_id</u>** - Remove a task
