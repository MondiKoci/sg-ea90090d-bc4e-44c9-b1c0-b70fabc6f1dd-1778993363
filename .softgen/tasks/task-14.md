---
title: Fix admin menu and add invoicing system
status: in_progress
priority: high
type: feature
tags: [admin, invoicing, bugfix]
created_by: agent
created_at: 2026-05-17T11:15:00Z
position: 14
---

## Notes
Fix missing admin dashboard navigation menu, implement complete invoicing system with generation/editing/preview/sending, and fix patient status update bug.

## Checklist
- [ ] Add admin navigation/sidebar menu
- [ ] Create invoices database table
- [ ] Create invoice service with CRUD operations
- [ ] Build admin invoice management page
- [ ] Add invoice generation with line items
- [ ] Implement PDF preview functionality
- [ ] Add send invoice to patient portal
- [ ] Display invoices in patient portal
- [ ] Fix patient status update bug in admin

## Acceptance
- Admin has accessible navigation menu
- Admin can create/edit/delete invoices
- Invoices can be previewed and sent to patients
- Patients can view their invoices in portal
- Patient status updates work correctly