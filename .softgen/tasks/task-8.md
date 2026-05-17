---
title: Blog CMS with admin management
status: todo
priority: high
type: feature
tags: [blog, cms, admin, database]
created_by: agent
created_at: 2026-05-17T03:41:00Z
position: 8
---

## Notes
Full blog system: public blog listing/detail pages + admin CMS for creating/editing posts. Support rich content, featured images, categories.

## Checklist
- [ ] Create blog_posts table (title, slug, content, excerpt, featured_image, author, published, category)
- [ ] Create blog storage bucket for post images
- [ ] Build admin blog management: list posts, create/edit/delete, upload images
- [ ] Create /blog page with post grid
- [ ] Create /blog/[slug] page for individual posts
- [ ] Add blog link to navigation
- [ ] Add blog section to admin dashboard

## Acceptance
- Admin can create/edit blog posts with rich content
- Blog posts display on public /blog page
- Individual posts accessible via slug URLs
- Featured images and formatting work correctly