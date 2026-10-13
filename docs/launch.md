# Guess You launch

Launch target: Tuesday, October 13, 2026, by end of day (America/New_York).
Sam owns `guessyou.app` at Porkbun.

## Prepared path

The repository is public. GitHub Pages supports static sites from public
repositories on GitHub Free. The manual `Publish Guess You` workflow builds only
the reviewed journey, its fonts, 304 display-size portraits, and the Resources
page. Its artifact is about 21 MB. The original Claude prototype, master images,
local review notes, and working files are excluded. The workflow has no push
trigger, so preparing it does not publish the site.

The site was published from `main` by GitHub Actions run 38420742949 on October
13. The reviewed journey loaded at the GitHub Pages address, including its
portraits and feeling selection. GitHub Pages is configured for `guessyou.app`.
At Porkbun, the apex ALIAS and `www` CNAME point to `scjolley.github.io`; the
registrar's wildcard parking record was removed. The custom HTTPS certificate
is pending. Shared reflections still contain the GitHub Pages address until
HTTPS works at `guessyou.app` and the build is republished with that URL.

## Launch sequence

1. Wait for GitHub to issue the custom-domain certificate. Check both
   `https://guessyou.app/` and `https://www.guessyou.app/` without bypassing
   certificate validation; confirm the second redirects to the first.
2. Once HTTPS works, run the manual Pages workflow again to publish the
   prepared `https://guessyou.app/` share URL.
3. Verify the final public address on desktop and mobile: opening animation,
   four suggestions, search and See more, portrait loading, one moving Keep my
   reflection control, copy/download/email drafts, Resources, and navigation.

The public site has no account, server database, or collection of written
reflections. Unmatched searches stay in each visitor's browser; the local
vocabulary review does not aggregate across visitors.
