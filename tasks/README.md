# Tasks

**The task table itself lives on the [repo front page](../README.md#tasks),** so everyone sees
it when they open the repo. This folder holds the reasoning behind it and the plan for when it
outgrows one table.

## The two conventions

**Dates as `YYYY-MM-DD`** — so `2026-10-15`, not `15.10.` or `Oct 15`. It sorts correctly, and
with twelve people across several countries nobody has to guess whether `05-10` means May or
October.

**Owner is a GitHub username**, written as `@username`, not a first name. The person gets
notified, and `Owner` means one nameable person rather than a department. If a task has no
owner yet, leave the cell empty rather than writing "everyone": a task owned by everyone is
owned by nobody.

## What this table cannot do

**It is a list, not a tracker.** It will not tell you what is overdue or half finished, and
checkboxes do not work: GitHub renders `- [ ]` in a repo file but does not let you click it.
That only works in issues and pull requests.

**Two people editing the same row will collide.** One table is fine while the list is short.

## When it outgrows this

**Around twenty rows**, split it into one file per department in this folder — `product.md`,
`tech.md`, `marketing.md`. People working on different things then never touch the same file.
The cost is that there is no single table any more.

**If you want real tracking**, GitHub Issues does it properly: the owner becomes an assignee,
the deadline a milestone, the department a label, checkboxes actually tick, and every task gets
its own discussion. Worth the switch once the table stops being enough.
