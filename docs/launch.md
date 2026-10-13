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

The site was published from `main` by GitHub Actions on October 13. The first
run was 38420742949 and the custom-domain run was 38421666313. The reviewed
journey is live at [https://guessyou.app/](https://guessyou.app/).
The live browser loaded the journey, its portraits, feeling selection, and
reflection dialog. The public reflection script contains the `guessyou.app`
share URL; the original Claude prototype and review tools remain in the repo.
The Resources page remains part of the published site.

GitHub Pages has verified ownership of `guessyou.app`, approved a certificate
for the apex and `www`, and enforces HTTPS. `www.guessyou.app` redirects to the
apex. GitHub Actions is the publishing source and the workflow remains manual.
At Porkbun, the apex ALIAS and `www` CNAME point to `scjolley.github.io`; the
registrar's wildcard parking record was replaced with the `www` record. A TXT
record verifies ownership with GitHub; keep it in DNS.

## Launch sequence

For future updates, commit and push the reviewed change to `main`, then run
the manual `Publish Guess You` workflow. Check the workflow result and visit
the live domain before considering the update published. Keep the public build
limited to the reviewed journey and display-size assets. Portrait feedback can
continue in the local background review without changing the public images.

The public site has no account, server database, or collection of written
reflections. Unmatched searches stay in each visitor's browser; the local
vocabulary review does not aggregate across visitors.
