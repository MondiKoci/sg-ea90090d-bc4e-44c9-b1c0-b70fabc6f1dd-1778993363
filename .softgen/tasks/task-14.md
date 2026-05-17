---
title: Fix admin menu and add invoicing system
status: done
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
- [x] Add admin navigation/sidebar menu
- [x] Create invoices database table
- [x] Create invoice service with CRUD operations
- [x] Build admin invoice management page
- [x] Add invoice generation with line items
- [x] Implement PDF preview functionality
- [x] Add send invoice to patient portal
- [x] Display invoices in patient portal
- [x] Fix patient status update bug in admin

## Acceptance
- Admin has accessible navigation menu
- Admin can create/edit/delete invoices
- Invoices can be previewed and sent to patients
- Patients can view their invoices in portal
- Patient status updates work correctly