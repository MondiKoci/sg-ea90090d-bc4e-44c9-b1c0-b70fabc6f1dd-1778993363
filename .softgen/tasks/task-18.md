---
title: File upload component and dark mode theme
status: done
priority: high
type: feature
tags: [file-upload, dark-mode, theme, documents]
created_by: agent
created_at: 2026-05-17T13:54:00Z
position: 18
---

## Notes
Create a secure file upload component for patients to attach medical records, ID documents, and other files. Implement a complete dark mode theme with switcher across both patient and admin portals.

## Checklist
- [x] Create patient_documents database table
- [x] Set up Supabase Storage bucket for documents
- [x] Create file service with upload/download/delete
- [x] Build FileUpload component with drag-and-drop
- [x] Add file type validation and size limits
- [x] Integrate FileUpload in patient portal
- [x] Integrate FileUpload in admin patient details
- [x] Define dark mode CSS variables
- [x] Create ThemeSwitch component
- [x] Add theme switcher to patient portal
- [x] Add theme switcher to admin sidebar
- [x] Test theme persistence across sessions

## Acceptance
- Patients can upload documents via drag-and-drop or file browser
- Admins can manage patient documents in patient detail page
- Documents are stored securely with proper access control
- Theme switcher works in both patient and admin portals
- Dark mode properly styles all UI components
- Theme preference persists across sessions