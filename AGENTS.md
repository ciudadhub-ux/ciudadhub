<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy rules (Hermes and any other agent)

`git push origin main` triggers `.github/workflows/deploy.yml`, which publishes straight to the live site at ciudadhub.info — there is no staging step, a push is an immediate public release.

- You may edit files, run `npm run dev` / `npm run blog:admin` for preview, and make local commits freely.
- **Never run `git push` without asking Andrés first and getting an explicit yes in that conversation.** Prepare the commit, then stop and ask — describe what changed and wait for confirmation before pushing.
- This applies every time, not just the first time — one approval does not authorize future pushes.
- If Andrés explicitly asks you to set up autopublish for a specific recurring case (e.g. a routine episode-upload format), that would be a separate, explicit standing rule added here — do not assume it from a single approval.
