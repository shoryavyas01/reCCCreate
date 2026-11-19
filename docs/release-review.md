# Publication review — 19 November 2026

## Completed in this release

- Removed public tracing pages, lookup forms, product/footer links and admin QR generation; retired URLs permanently redirect to Shop.
- Added privacy, terms and orders/delivery/returns policies, shared footer navigation and required form consent.
- Added canonical metadata, per-page social metadata, sitemap, robots rules, structured data, favicons and a social share image. Preview deployments are noindex.
- Improved form error handling, request validation/body limits, origin checks, server-side consent checks, price validation and duplicate prevention. No real test messages were sent.
- Preserved the existing Google Sheet contact, volunteer and order workflows. A read-only check of the configured production script returned HTTP 200 and version 3 on the review date.
- Preserved all product prices and project impact figures.

## Verification

The repeatable commands are in README.md. The release smoke script checks eight public pages, unique titles/descriptions and canonical URLs, internal links/anchors, image files, share assets, indexing rules, security headers, the missing-page HTTP status, retired trace redirects and rejection of incomplete API submissions. Form tests mock every delivery provider.

A read-only script health/version check verifies availability and capability; it does not prove a real submission reached the team’s Sheet. No unauthorised message was sent to establish that claim.

## Owner-dependent launch steps

- Supply the purchased GoDaddy domain name. It is not currently listed on the Vercel project. Its DNS and certificate must be verified before making it canonical.
- Confirm the real responsible seller/adult supervisor and any required business/grievance contact details before operating as a commercial seller. Policies contain current known project details and do not assert legal certification.
- Confirm the team inbox is monitored and operational policies/pack declarations match actual fulfilment.
- Submit the final verified domain’s sitemap in the owner’s Search Console account if desired; no ranking or indexing guarantee is made.

## Reference material consulted

- Google Search Central: https://developers.google.com/search/docs/appearance/title-link
- Google Search Central sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Consumer Affairs rules/publications: https://consumeraffairs.gov.in/pages/consumer-protection-acts
- MeitY DPDP rules and enforcement timeline: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
