# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4f4fe83a-fb09-4244-b842-aeca9cbf8317

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4f4fe83a-fb09-4244-b842-aeca9cbf8317) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Laravel CMS backend (Filament + APIs)

This project now includes a Laravel backend CMS in `backend/` with:
- Filament admin panel at `http://127.0.0.1:8000/admin`
- Public APIs:
  - `GET /api/v1/pages/{slug}`
  - `GET /api/v1/projects`
  - `GET /api/v1/settings`

Default admin user after seeding:
- Email: `admin@atech.local`
- Password: `Atech@12345`

Run backend locally:

```sh
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Connect frontend to backend API:

```sh
cp .env.example .env.local
# ensure VITE_API_BASE_URL=http://127.0.0.1:8000
npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4f4fe83a-fb09-4244-b842-aeca9cbf8317) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## CMS (Decap) for managing content

We added a lightweight CMS so you can edit homepage content without changing code.

- Admin URL (local): `/admin/`
- Content file: `public/content/home.json`
- You can edit hero text, CTAs, and services. Icons available: Code, Smartphone, Palette, Settings.

How to run locally:

```sh
npm i
npm run dev
# open http://localhost:8080/admin/
```

Deploy notes:
- The CMS UI is static and works on any static host. For Git-based editing (git-gateway), ensure your host integrates with your repo provider or use a Netlify-compatible setup. Alternatively, you can edit JSON directly.
- If using a different default branch than `main`, update `public/admin/config.yml`.

### Manage content with CMS

- Open `/admin` while dev server is running to access the CMS.
- Pages live under `Pages` in the sidebar (About, Services, Projects page intro, FAQs, Contact).
- Projects live under `Projects` where you can add/edit items (title, summary, images, body).
- Homepage content is under `Homepage`.

If you don’t see changes, refresh the site and clear cache. For production, ensure your hosting allows Git-based writes (git-gateway) or edit JSON files directly in the repo.

### Run the CMS GUI locally

In one terminal:
```sh
npm run dev
```
In another terminal:
```sh
npm run cms
```
Then open `http://localhost:8080/cms-admin/index.html`.

### Authentication (demo)

This project includes a simple local demo auth (not for production):
- Default admin: username `admin`, password `Atech@12345`
- Users you create via Sign Up are regular users.

How to use:
- Use the header links to Login or Sign Up
- Once logged in as admin, use the Admin button (or visit `/cms`) to access the CMS GUI at `/cms-admin/`
- Logout from the header

Notes: Credentials are stored in browser localStorage for demo purposes only.