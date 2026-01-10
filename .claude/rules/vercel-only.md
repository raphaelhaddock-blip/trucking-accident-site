# VERCEL ONLY - NO LOCAL DEV SERVER

## MANDATORY RULE

**NEVER run `npm run dev` or start a local development server.**

All testing and verification must be done via Vercel preview URL.

## Vercel Preview URL (for team sharing)

**https://trucking-accident-site.vercel.app**

This URL is for internal team review only - not public/live yet.

## Workflow

1. Make code changes
2. Commit and push to git
3. Vercel auto-deploys
4. Share Vercel URL with team for review
5. Verify with `curl` against Vercel URLs

## Forbidden Commands

```bash
# NEVER RUN THESE
npm run dev
npm start
./init.sh
```

## Verification Commands

```bash
# Check homepage
curl -s -o /dev/null -w "%{http_code}" https://trucking-accident-site.vercel.app

# Check state page
curl -s -o /dev/null -w "%{http_code}" https://trucking-accident-site.vercel.app/states/texas

# Check city page
curl -s -o /dev/null -w "%{http_code}" https://trucking-accident-site.vercel.app/states/texas/houston

# Check accident page
curl -s -o /dev/null -w "%{http_code}" https://trucking-accident-site.vercel.app/accidents/jackknife-accidents
```

## Why

- Local dev is slow with 1,600+ pages
- Team can review on shared Vercel URL
- No need to run locally just to show progress
- Everyone sees the same thing
