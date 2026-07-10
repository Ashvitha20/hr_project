# Future Focus HR Solutions — Frontend

React 19 + Vite + MUI + Redux Toolkit + React Router + React Query frontend for the
Future Focus HR Solutions recruitment platform.

## What's included in this module

- **Public website**: Home, About, Services, Industries, Testimonials, Contact,
  FAQs, Privacy, Terms, 404 — all built to the brand's green/blue palette from
  the provided logo and brochure.
- **Career portal**: Job listing with client-side search/filter (department,
  employment type, keyword) and a job detail page with related jobs, save/share
  actions, and an apply CTA that gates on login.
- **Blog**: List and detail pages.
- **Auth pages**: Login (role-aware redirect), Register (candidate), Forgot
  Password — wired to `axiosClient` calling the (not-yet-built) `/auth/*` API,
  with React Hook Form + Yup validation and inline error/success states.
- **Candidate / HR / Admin dashboards**: Each has its own sidebar layout and a
  populated overview page. Sub-pages (profile, applicants, manage jobs, etc.)
  are scaffolded as clearly-labeled placeholders — the routing, layout, and
  role-based access are real; the data tables/forms are the next module.
- **State & data layer**: Redux Toolkit slice for auth (JWT + user, persisted to
  `localStorage`), an Axios client with automatic access-token attachment and
  silent refresh-token retry on 401, and React Query wired up at the root for
  whichever pages start fetching real data next.
- **Role-based route protection**: `ProtectedRoute` redirects unauthenticated
  users to `/login` and blocks users whose role isn't in `allowedRoles`.

## What is NOT included yet (by design)

Per the "module-by-module" approach: there is no backend in this delivery, so
job data, blog posts, and testimonials on the public site currently come from
`src/data/sampleJobs.js` — a file explicitly commented as placeholder data
shaped to match the intended API contracts. Every place that will eventually
call a real endpoint has a comment noting the exact route to wire in (e.g.
`GET /jobs`, `POST /auth/login`, `GET /hr/applications`).

The candidate/HR/admin sub-pages beyond the dashboard overview are
placeholders (`PlaceholderPage` component) so the navigation and access control
are ready, without faking data tables that would need to be thrown away.

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend URL
npm run dev
```

## Project structure

```
src/
  api/axiosClient.js        # Axios instance + JWT/refresh interceptors
  app/store.js               # Redux store
  components/
    layout/                  # Navbar, Footer, PublicLayout, DashboardLayout
    common/                  # SectionHeading, JobCard, Loader, PlaceholderPage
  features/auth/             # authSlice + Login/Register/ForgotPassword pages
  pages/
    public/                  # Home, About, Services, Industries, ...
    careers/                 # Job listing + job detail
    blog/                    # Blog list + detail
    dashboard/
      candidate/ hr/ admin/  # Layout + overview + placeholder sub-pages
  routes/ProtectedRoute.jsx  # Auth + role guard
  data/sampleJobs.js         # Placeholder data (see comments)
  theme.js                   # MUI theme (brand palette)
  App.jsx / main.jsx
```

## Next module

Recommended order per the original project brief: **Authentication API**
(so Login/Register/ForgotPassword go from wired-but-mocked to fully working),
then **Job & Application APIs** (to replace `sampleJobs.js`), then the
Admin/HR management CRUD screens.
