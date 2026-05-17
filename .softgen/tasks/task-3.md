---
title: Public booking form
status: todo
priority: high
type: feature
tags: [frontend, forms]
created_by: agent
created_at: 2026-05-17T03:28:59Z
position: 3
---

## Notes
Build a public-facing appointment booking form accessible from the homepage. Captures initial patient inquiry with essential contact and treatment information.

## Checklist
- [ ] Create BookingForm.tsx component with form validation
- [ ] Fields: full name, email, phone, treatment interest, preferred arrival date, message
- [ ] Success confirmation with next steps message
- [ ] Add booking form to homepage (new section or modal from CTA)
- [ ] Form submissions create patient records in database

## Acceptance
- Users can submit booking requests without authentication
- Form validates required fields and displays errors
- Successful submission shows confirmation message