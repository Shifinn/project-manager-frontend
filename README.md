# Project Manager Frontend

Project Manager is an Angular web application for organizing software projects and the work assigned to them. It gives users one place to review their tasks, manage project structure, track bugs, and plan work on a timeline.

This repository contains the frontend. It communicates with a REST backend for authentication, project data, work items, assignments, and related changes.

## What the application includes

### Login

Users sign in with a username and password. The form checks that both fields are filled before sending credentials to the backend. Failed requests show an error message, while successful login stores the returned user and project context in `localStorage` and redirects the user to the main workspace.

### My Work

The dashboard gives each user a personal view of their assigned work:

- Groups work by its current state.
- Shows the number of work items in each state.
- Summarizes priority distribution with a visual progress bar.
- Lets users expand a state to inspect its individual work items.
- Refreshes the displayed work when related item state changes.

### Projects

The project page is the project directory for the current user. It:

- Lists ongoing projects with their project name and ID.
- Shows each project's completion percentage.
- Displays the project owner or PIC.
- Shows the planned start and target dates with period progress.
- Opens project details from a project card.
- Lets users enter a project workspace from the project card.
- Separates completed projects into a `Done Projects` section.
- Shows project creation controls to users with the webmaster role.

### Backlog

The backlog breaks a project into manageable sub-modules and their work:

- Lists the sub-modules belonging to the selected project.
- Shows work-state distribution for each sub-module.
- Shows the sub-module's planned period and progress.
- Expands a sub-module to reveal its associated work items.
- Opens a sub-module detail form for editing or inspection.
- Provides a control for adding a new sub-module.
- Removes a sub-module from the current list after deletion.
- Refreshes the list when a new sub-module is created.

### Bugs

The bugs page collects bug-related work for the selected project:

- Displays bugs in a vertical list.
- Shows bug work using the application's expandable work-card layout.
- Keeps the work state and priority indicators consistent with the My Work view.
- Lets users expand a bug entry to inspect its related work.
- Omits empty bug entries, except for the first entry so the page can still present the available bug context.

### Gantt Chart

The Gantt page provides a visual schedule for project work:

- Displays modules and their work items alongside a day-by-day timeline.
- Groups the timeline into month and year sections.
- Shows assigned users for each work item, or `No Users Assigned` when no one is assigned.
- Marks the current day on the timeline.
- Highlights overdue work.
- Shows start date, target date, and duration in the work-item tooltip.
- Opens module details when a module name is selected.
- Opens work details when a work item is selected.
- Supports filters for tracker, activity, state, users, and assignment status.
- Lets users drag across the chart to navigate the timeline.
- Lets users drag or resize work bars to adjust scheduled dates.

## Navigation

After login, the application uses a shared workspace layout with a collapsible sidebar and project header:

| Area | Route |
| --- | --- |
| Login | `/` |
| My Work | `/home/(home:dashboard)` |
| Projects | `/home/(home:project)` |
| Backlog | `/home/(home:backlog)` |
| Bugs | `/home/(home:bug)` |
| Gantt Chart | `/home/(home:gantt)` |

The pages are loaded through Angular's router, and the workspace pages use the named `home` outlet.

## Tech stack

- Angular 19
- TypeScript 5.7
- Angular Material and Angular CDK
- RxJS
- Angular Signals for local and shared reactive state
- REST API integration through Angular `HttpClient`
