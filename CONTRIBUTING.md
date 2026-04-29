# Developer Workflow

## Project Board
All work is tracked on the [GitHub Project Board](https://github.com/users/ajynky/projects/4).

## Branch Naming Convention
Branches must follow this pattern for automation to work:
{type}/issue-{number}-{short-description}

Examples:
devops/issue-1-actuator-health-checks
feature/issue-23-grade-analytics
bug/issue-45-fix-login-error

## Workflow — How a Task Moves Through the Board
Pick issue from Backlog
Create branch → issue auto-moves to In Progress
Write code, commit with "Closes #<number>" in message
Open PR → issue auto-moves to In Review
Merge PR → issue auto-moves to Done
Deploy fails → bug issue auto-created