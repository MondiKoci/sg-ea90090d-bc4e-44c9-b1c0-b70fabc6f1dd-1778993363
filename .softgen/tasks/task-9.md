---
title: Destinations package builder
status: in_progress
priority: high
type: feature
tags: [admin, packages, cms]
created_by: agent
created_at: 2026-05-17T03:52:15Z
position: 9
---

## Notes
Build a package builder in the admin dashboard allowing creation of customizable dental tourism packages. Include all service categories: dental treatments, accommodation, transport, tours, meals, warranties, and remote support.

Typical destinations: Turkey, Albania, Hungary, Mexico (cost comparison vs Italy, Germany, UK, US)

## Checklist
- [ ] Create packages table (name, destination, price, duration, description, status)
- [ ] Create package_inclusions table for checklist items
- [ ] Admin page: create/edit packages with all inclusion categories
- [ ] Package management UI: add inclusions, set pricing, publish/unpublish
- [ ] Public packages display on destination section or dedicated page
- [ ] Integration with booking form (package selection)

## Acceptance
- Admin can create packages with custom inclusions
- Packages display on public site
- Users can select packages when booking
- All inclusion categories are supported