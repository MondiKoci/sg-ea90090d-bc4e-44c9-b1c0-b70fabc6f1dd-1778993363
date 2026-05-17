---
title: Database schema and backend services
status: done
priority: urgent
type: feature
tags: [database, backend, supabase]
created_by: agent
created_at: 2026-05-17T03:28:59Z
position: 2
---

## Notes
Set up Supabase database tables, storage buckets, and service layer for patient management system. Handle authentication, file uploads, and data access patterns.

## Checklist
- [x] Create patients table with all fields (name, contact, dates, accommodation, payment notes)
- [x] Create patient_files table for quotes/receipts uploads
- [x] Create patient_reminders table for reminder tracking
- [x] Create patient_shares table for granular sharing permissions
- [x] Create storage buckets for file uploads (patient-documents)
- [x] Set up RLS policies (admin access for full CRUD, public insert for booking form)
- [x] Create patientService.ts for all patient CRUD operations
- [x] Create fileService.ts for upload/download operations
- [x] Create reminderService.ts for reminder management
- [x] Create sharingService.ts for patient data sharing

## Acceptance
- Admin can create, read, update, delete patient records
- Files upload successfully to storage and link to patients
- RLS policies allow public booking submissions and admin full access