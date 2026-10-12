# Guess You launch

Launch target: Tuesday, October 13, 2026 (America/New_York). The domain owner
and exact launch time still need confirmation. Do not publish early.

## Prepared path

The repository is public. GitHub Pages supports static sites from public
repositories on GitHub Free. The manual `Publish Guess You` workflow builds only
the reviewed journey, its fonts, 304 display-size portraits, and the Resources
page. Its artifact is about 21 MB. The original Claude prototype, master images,
local review notes, and working files are excluded. The workflow has no push
trigger, so preparing it does not publish the site.

The first public address can be `https://scjolley.github.io/guess-you/`.
Buying `guessyou.app` is separate. The launch can proceed at the GitHub address
if domain checkout or DNS is still pending. The exported reflection uses the
working public address; update it when the custom domain works.

## Launch sequence

1. Confirm the final approved feeling vocabulary and launch time with Sam.
2. Confirm `main` is clean and run `python3 scripts/build_public.py` into an
   empty temporary directory. Check the result in a browser and run the tests.
3. Enable GitHub Pages with GitHub Actions as the publishing source for this
   repository. The Pages site does not exist yet.
4. Run the manual `Publish Guess You` workflow at the agreed time. Check that
   the workflow succeeds, then open the public HTTPS URL on desktop and mobile.
5. Test: opening animation, four suggestions, search and See more, portrait
   loading, one moving Keep my reflection control, copy/download/email drafts,
   Resources, and a clean return to the top.
6. Once Sam owns `guessyou.app`, verify the domain in GitHub, set it as the Pages
   custom domain, configure the registrar's DNS records using GitHub's current
   instructions, and wait for HTTPS to work. Update the exported website link
   to the custom domain and republish. A `.app` address requires HTTPS.

The public site has no account, server database, or collection of written
reflections. Unmatched searches stay in each visitor's browser; the local
vocabulary review does not aggregate across visitors.
