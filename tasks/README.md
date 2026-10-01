# Tasks

The dedicated area for who does what, by when. Nothing else lives in this folder.

Open [`github.com/Corners-Connect/corners-connect/tree/main/tasks`](https://github.com/Corners-Connect/corners-connect/tree/main/tasks)
and this page is what you see. One row per task.

| Action | Department | Owner | Start date | Deadline |
|---|---|---|---|---|
| _No tasks yet_ | | | | |

## Adding a task

You do not need git installed. Open this file on GitHub, press the pencil icon, add your row,
then choose **"Create a new branch for this commit and start a pull request"**. Someone else
glances at it and merges. That is the whole process.

## Two conventions, so the table stays usable

**Dates as `YYYY-MM-DD`** — so `2026-10-15`, not `15.10.` or `Oct 15`. It sorts correctly, and
with twelve people across several countries nobody has to guess whether `05-10` means May or
October.

**Owner is a GitHub username**, written as `@username`, not a first name. The person gets
notified, and `Owner` means one nameable person rather than a department. If a task has no
owner yet, leave the cell empty rather than writing "everyone": a task owned by everyone is
owned by nobody.

## If this starts to hurt

**Two people editing the same row** will collide. One table is fine while the list is short.
If it becomes a regular problem, split it into one file per department in this folder
(`product.md`, `tech.md`, `marketing.md`) — people working on different things then never
touch the same file. The cost is that there is no single table any more.

**Nothing here tells you what is overdue or half finished.** It is a list, not a tracker. At
roughly twenty rows, GitHub Issues does the job properly: the owner becomes an assignee, the
deadline a milestone, the department a label, and every task gets its own discussion thread.
