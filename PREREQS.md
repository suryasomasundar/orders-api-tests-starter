# Before the session

Takes about 15 minutes. Works the same on Windows, macOS and Linux.

## Install

| What | Why | Check it |
|---|---|---|
| Node 20 or newer | runs the tests | `node -v` |
| Git | clone the repo | `git --version` |
| VS Code or IntelliJ IDEA | where we work | opens |
| An AI coding agent in that editor | writes the tests | see below |
| Postman | call the API by hand | opens |
| A GitHub account | clone and push | you can sign in |

## The agent, and an account for it

Pick one. The account matters as much as the install, so check you can sign in.

- **Claude Code:** `npm install -g @anthropic-ai/claude-code`, then run `claude` and sign in. Needs a Claude Pro or Max plan, or API credits.
- **GitHub Copilot:** install the extension in your editor. Needs an active Copilot subscription.

## Get the repo

```
git clone https://github.com/suryasomasundar/orders-api-tests-starter
cd orders-api-tests-starter
npm test
```

All tests should pass. There is nothing to install: the repo has zero dependencies.

## Check the API is reachable

Open https://orders-api-workshop.onrender.com/docs in a browser.

The first load can take up to a minute because the server sleeps when idle. If you see the API documentation page, you are ready.

## If you are on a work laptop

Three things are commonly blocked. Test them today, not on the day:

- Running `npx`, which downloads a package on the fly
- Reaching `onrender.com`
- Reaching your agent's service (`anthropic.com` or `github.com`)

A VPN or proxy can block any of these.

## Not needed

No Docker, no database, no Java or Python, no paid tools beyond your agent subscription.

## Optional

A GitHub personal access token, if you want to try the part where the agent opens a pull request.
