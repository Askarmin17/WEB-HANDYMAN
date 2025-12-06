# WEB-HANDYMAN Backend (Ready to Deploy)

This package contains a ready-to-deploy Node.js backend for the WEB-HANDYMAN project.

## Included files
- server.js       (main server)
- db.js           (MySQL connection pool using env vars)
- package.json    (dependencies and start script)
- .gitignore

## How to use
1. Add this folder to your GitHub repo in a folder named `backend/`.
2. Remove any `node_modules/` from the repo.
3. On Railway:
   - Create a new project -> Deploy from GitHub
   - Set root directory to `/backend` (if backend is inside a folder)
   - Add a MySQL service and import your `tukang_db.sql`
   - Configure environment variables:
     - DB_HOST
     - DB_USER
     - DB_PASS
     - DB_NAME
4. Deploy. Railway will run `npm install` and `npm start`.

## Notes
- Passwords currently stored plain in the database as in your SQL dump.
  For production, **hash passwords** (bcrypt) and use HTTPS.
- You can extend endpoints as needed.
