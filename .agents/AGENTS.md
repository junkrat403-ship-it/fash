# AGENTS.md — Workspace Standing Rules

## Deployment Reminders

Whenever you make any changes to the backend API (NestJS app under `apps/api` or wherever the API package lives) — including new endpoints, modified logic, schema/migration changes, or bug fixes — you MUST end your response by reminding the user that these changes need to be pushed to GitHub and redeployed on Render, since Render auto-deploys from the connected GitHub repo. Do not assume the user will remember this.

Include a clear, detailed step-by-step git guide every time, from checking status to pushing, for example:

1. Check what changed: `git status`
2. Review the diff if needed: `git diff`
3. Stage the changes: `git add .` (or `git add <specific-files>` if you only want to stage certain files)
4. Commit with a clear, descriptive message: `git commit -m "fix: <short description of the API change>"`
5. Push to the remote branch: `git push origin <branch-name>` (usually `main` or `master` — confirm the current branch first with `git branch --show-current`)
6. After pushing, Render will automatically detect the new commit and start redeploying the API service — remind the user to check the Render dashboard's deploy logs to confirm the deployment succeeds, since a failed deploy (e.g. build error, missing env var) would mean the live API is still running the old code.

This reminder should apply specifically to API/backend changes (since that's what's deployed separately to Render) — frontend-only changes don't need this reminder unless the user is also deploying the frontend somewhere.
