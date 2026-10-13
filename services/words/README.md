# Shared vocabulary collection

Opt-in collection for Guess You, on Cloudflare Workers Free + D1 Free. The website stays hosted on GitHub Pages. No paid plan was enabled.

The public endpoint accepts only a short phrase and explicit consent. It never receives reflection fields. D1 stores only `word` and `count`. Email addresses, numbers, URLs, phrases over 80 characters, and unexpected request fields are rejected. This filtering cannot reliably detect names, so the UI also asks people to leave out personal details. The endpoint rate-limits submissions; network addresses are processed by Cloudflare's limiter but are not written to D1. Worker application logging is disabled. Counts measure submissions, not unique people.

## Private review

Sign in to Cloudflare and open [the private data browser](https://dash.cloudflare.com/9b495f0be9f472aefa7c716c34820a32/workers/d1/databases/da15e7af-f57b-4d22-9c7d-6fb9f59d2385/studio). Choose the `word_review` view for phrases sorted by submission count. Or open **Console** and run:

```sql
SELECT word, count FROM words ORDER BY count DESC, word ASC LIMIT 500;
```

From this directory, `npm run review` retrieves the same list using the signed-in Wrangler CLI. No public read endpoint exists. Do not commit exports containing visitor submissions.

## Maintenance

- `npm test` checks consent, validation, counting, origin restrictions and service failures.
- `npm run deploy` publishes the Worker after a code change.
- `wrangler d1 execute guess-you-words --remote --file schema.sql` initializes the schema (idempotent).
- Frontend endpoint: `design/word-collection.js`.
- Cloudflare credentials remain outside the repository in Wrangler's own configuration.
- No historical browser-only searches are uploaded. Submitting a phrase is always a separate visitor action.
- The site confirms a save only after the API confirms it. If the free quota is exhausted, submission fails gracefully and visitors can continue reflecting. There is no automatic paid upgrade.

An unresolved submission doesn't automatically become a search match; review vocabulary before adding it to the language mappings.
