# StudioSpace

**Live site URL** — Pending the first deployment. Replace this line with the public HTTPS address Netlify assigns to your project.

The Studio Index is the visual edition of StudioSpace, an hourly studio directory for independent creators in Bangladesh. A host lists the space and equipment. A creator checks the available hours, sees the rental and deposit separately, and sends a reservation request.

## Features

- Browse six featured studios from MongoDB and filter the directory by space type, room name or location.
- Inspect a photo gallery, amenities, capacity, host and reviews before reserving.
- Register with email and a profile photo, or sign in with Google. A session check keeps private pages usable after refresh.
- Publish, update and delete your own spaces. Supply gallery URLs or upload real image files to ImgBB.
- Reserve whole-hour sessions, track status, and cancel pending bookings. Hosts manage incoming requests from the dashboard.
- Switch between light and dark themes on desktop, tablet or mobile. Actions use toast feedback and confirmation dialogs.

## Stack

Next.js App Router, React, JavaScript, DaisyUI badge styles, custom CSS, Radix Dialog, Lucide, Swiper and Sonner. Express, Better Auth with its MongoDB adapter, signed JWT access cookies and MongoDB run in the Netlify API function. The application uses one public origin.

## Run locally

1. Use Node 22.13+ and npm. Open the server project in a separate terminal.
2. In the server folder run `npm ci` and `npm run setup`. For a local database run `docker compose up -d --wait`. For Atlas, set `MONGODB_URI` and `MONGODB_DB` in the generated .env instead.
3. In the server terminal run `npm run seed` followed by `npm run dev`.
4. In this client folder run `npm ci` and `npm run dev`.
5. Open [StudioSpace on localhost](http://localhost:3000). Keep this hostname throughout the session. The client forwards /api requests to port 4000 during local development.

## Examiner test credentials

Run the seed against the database used by the application before testing.

| Account | Email | Password |
| --- | --- | --- |
| Creator | creator@studiospace.example | StudioGuest42 |
| Host | host@studiospace.example | StudioHost42 |

Book a future slot as the creator. Open another browser profile as the host to confirm it. Refresh My bookings in the first profile to see the confirmation. A separate pending request can demonstrate cancellation. The seed runs intentionally from the command line. To change the demo passwords on a fresh database, set SEED_HOST_PASSWORD and SEED_CREATOR_PASSWORD before seeding and update the examiner credentials above.

## Netlify

Import this client repo as a Netlify project. Keep the base directory blank. The tracked netlify.toml selects the build command, .next output and functions folder. The Express source package is already included in vendor/. No private repo token is needed by the build.

Set the function runtime environment variables from the server’s .env.example in the Netlify project settings. APP_ORIGIN must be the final public HTTPS origin. Configure Better Auth and JWT secrets, Atlas, Google OAuth and ImgBB, then redeploy. Register the exact Google callback `https://YOUR-SITE.netlify.app/api/auth/callback/google`. Seed the same Atlas database once from the server project.

Open `/api/health` on your public domain, then sign in, directly reload `/my-bookings`, open a studio URL and place a booking. Record the verified live URL at the top of this README and push the change to GitHub.

## Reading the UI

Start in app/page.jsx. The campaign carousel, location search and featured directory live in components/Hero.jsx, components/StudioFinder.jsx and components/HomeDirectory.jsx. app/catalog.css covers discovery, and app/desk.css covers forms and account pages. For the full request path, follow components/BookingPanel.jsx to lib/api.js and then src/bookings.js in the server repository. See ASSETS.md for image provenance.
