---
title: In-app notification system
status: done
priority: high
type: feature
tags: [notifications, alerts, patient, admin]
created_by: agent
created_at: 2026-05-17T13:28:00Z
position: 15
---

## Notes
Build a real-time notification system for patients and admins. Patients get notified when invoices are issued. Admins get notified when patients submit booking forms.

## Checklist
- [x] Create notifications database table
- [x] Create notification service with CRUD operations
- [x] Add notification bell component for patient portal
- [x] Add notification bell component for admin dashboard
- [x] Integrate with invoice creation (notify patient)
- [x] Integrate with booking form submission (notify admin)
- [x] Add mark as read functionality
- [x] Add notification count badges
- [x] Add notification list dropdown

## Acceptance
- Patients see notification bell in portal
- New invoice notifications appear automatically
- Admins see notification bell in admin panel
- Booking form submissions trigger admin notifications
- Unread count displays on notification bell
- Users can mark notifications as read