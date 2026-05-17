---
title: Dynamic treatments with admin management
status: in_progress
priority: high
type: feature
tags: [admin, cms, treatments, seo]
created_by: agent
created_at: 2026-05-17T04:17:26Z
position: 11
---

## Notes
Convert static treatments to a dynamic CMS system. Create admin interface for managing treatments with full content, images, pricing, and savings percentages. Build SEO-optimized treatment detail pages following best practices.

## Checklist
- [ ] Create treatments database table with all necessary fields
- [ ] Build treatmentService for CRUD operations
- [ ] Create admin management page at /admin/treatments
- [ ] Update homepage Treatments section to fetch from database
- [ ] Change treatment cards to display "Save up to X%" instead of prices
- [ ] Create treatment detail page at /treatments/[slug] with SEO optimization
- [ ] Add schema.org markup for medical procedures
- [ ] Include before/after gallery integration on detail pages
- [ ] Add related treatments suggestions
- [ ] Update navigation to link to treatments

## Acceptance
- Admin can create/edit/delete treatments
- Treatment cards show savings percentage
- Detail pages have rich content, FAQs, and CTAs
- SEO markup is complete with schema.org
- Treatment detail pages are shareable with proper meta tags
</tool_call_response>