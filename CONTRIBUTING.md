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

<short description>
detail 1
detail 2
Closes #<issue-number>

Example:
Add Spring Actuator health checks to all services

Added actuator dependency to all 5 pom.xml files
Configured health, metrics, prometheus endpoints
Enables Railway readiness probes
Closes #1

## Labels
| Label | Used For |
|---|---|
| `feature` | New functionality |
| `bug` | Something broken |
| `devops` | CI/CD, infrastructure, tooling |
| `audit-service` | Audit service specific |
| `performance` | Performance improvements |
| `frontend` | UI changes |
| `backend` | API / service changes |
## Milestones
Each milestone = one week of work at 2 hours/day.
Every issue must be assigned to a milestone before starting.