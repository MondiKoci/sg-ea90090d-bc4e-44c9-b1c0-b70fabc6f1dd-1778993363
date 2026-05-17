---
title: Before & After gallery with admin management
status: todo
priority: high
type: feature
tags: [gallery, admin, database]
created_by: agent
created_at: 2026-05-17T03:41:00Z
position: 7
---

## Notes
Create Before & After case gallery on homepage with admin CRUD interface. Store images in Supabase Storage, metadata in database.

## Checklist
- [ ] Create before_after_cases table (treatment type, description, before/after image URLs)
- [ ] Create storage bucket for case images
- [ ] Build admin interface: add/edit/delete cases, upload images
- [ ] Create BeforeAfter.tsx component for homepage gallery
- [ ] Display cases with image comparison slider or side-by-side view
- [ ] Add case management to admin navigation

## Acceptance
- Admin can add cases with before/after images
- Cases display on homepage in attractive gallery
- Images load from Supabase Storage correctly