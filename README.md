docker-compose up
docker exec -it mysql bash
mysql -u root -p :: 123456

tasks (description, user, status (OPEN, IN_PROGRESS, DONE), started_at, ended_at, created_at)

    crud
        read filter: description, status[]
        read order: user, status, created_at
    start
    end
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
