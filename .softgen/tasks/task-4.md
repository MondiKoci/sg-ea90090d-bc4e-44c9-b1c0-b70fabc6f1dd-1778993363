---
title: Admin dashboard and patient management
status: todo
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
- [ ] Create /admin/patients page with patient list table
- [ ] Create /admin/patients/[id] detail page with full patient information
- [ ] Patient detail view: display all fields, edit mode, file uploads
- [ ] File management: upload quotes/receipts, view/download, delete
- [ ] Payment tracking UI: total amount, first payment, second payment with notes
- [ ] Reminder system: add/edit/complete reminders for each patient
- [ ] Sharing controls: add specific email addresses to share patient data
- [ ] Admin authentication: simple email/password login page
- [ ] Protected route wrapper for admin pages

## Acceptance
- Admin can log in and access dashboard
- All patient fields are viewable and editable
- Files upload, display, and download correctly
- Reminders can be created and managed
- Patient data can be shared with specific contacts