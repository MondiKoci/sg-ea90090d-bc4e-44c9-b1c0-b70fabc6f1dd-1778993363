---
title: Client portal with treatment progress tracking
status: done
priority: high
type: feature
tags: [auth, portal, patient, admin]
created_by: agent
created_at: 2026-05-17T04:39:10Z
position: 12
---

## Notes
Build a patient portal where clients can log in and track their treatment journey. Admin can manage unique treatment steps for each patient with instructions. Patients see completed steps and upcoming steps with doctor's notes.

## Checklist
- [x] Create treatment_steps database table
- [x] Create patient login page at /portal/login
- [x] Create patient dashboard at /portal/dashboard
- [x] Add treatment progress timeline component
- [x] Update admin patient detail page to manage treatment steps
- [x] Add step status management (completed/upcoming)
- [x] Add doctor instructions/notes per step
- [x] Implement patient authentication
- [x] Add logout functionality
- [x] Add portal navigation

## Acceptance
- Patients can log in to their portal
- Dashboard shows personalized treatment timeline
- Completed steps are marked clearly
- Upcoming steps show doctor's instructions
- Admin can add/edit/delete steps for each patient
- Each patient sees only their own treatment journey