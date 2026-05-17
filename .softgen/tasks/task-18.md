---
title: File upload component and dark mode theme
status: in_progress
priority: high
type: feature
tags: [upload, files, theme, dark-mode]
created_by: agent
created_at: 2026-05-17T13:52:00Z
position: 18
---

## Notes
Build a secure file upload component for patients to submit medical records, ID documents, and other files. Implement dark mode theme system with switcher accessible from both patient and admin portals.

## Checklist
- [ ] Create patient_documents database table
- [ ] Build file upload component with drag-and-drop
- [ ] Integrate Supabase Storage for file uploads
- [ ] Add document type categorization (medical records, ID, other)
- [ ] Add file preview and download functionality
- [ ] Display uploaded documents in patient portal
- [ ] Add dark mode color variables to globals.css
- [ ] Create theme switcher component
- [ ] Add theme switcher to patient portal
- [ ] Add theme switcher to admin portal
- [ ] Test dark mode across all components

## Acceptance
- Patients can upload documents via drag-and-drop or file picker
- Files are stored securely in Supabase Storage
- Uploaded documents are visible in patient portal and admin patient detail page
- Theme switcher is accessible and functional
- Dark mode properly styles all UI components
- Theme preference persists across sessions