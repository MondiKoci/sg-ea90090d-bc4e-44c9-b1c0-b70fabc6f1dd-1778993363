---
title: Admin dashboard and patient management
status: in_progress
priority: high
type: feature
tags: [frontend, admin, dashboard]
created_by: agent
created_at: 2026-05-17T03:28:59Z
position: 4
---

## Notes
Build comprehensive admin dashboard for managing patient records, files, payments, reminders, and sharing. Protected route requiring authentication.

## Checklist
- [x] Create /admin/patients page with patient list table
- [x] Create /admin/patients/[id] detail page with full patient information
- [x] Patient detail view: display all fields, edit mode, file uploads
- [x] File management: upload quotes/receipts, view/download, delete
- [x] Payment tracking UI: total amount, first payment, second payment with notes
- [x] Reminder system: add/edit/complete reminders for each patient
- [x] Sharing controls: add specific email addresses to share patient data
- [x] Admin authentication: simple email/password login page
- [x] Protected route wrapper for admin pages

## Acceptance
- Admin can log in and access dashboard
- All patient fields are viewable and editable
- Files upload, display, and download correctly
- Reminders can be created and managed
- Patient data can be shared with specific contacts