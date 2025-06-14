##PRVA VERZIJA (MIJENJAT ĆE SE)##

**Music Recommender App**

Web aplikacija za preporuku muzičkih albuma i izvođača. Implementirana autentifikacija sa JWT i PostgreSQL.

**Tech Stack**
Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express, Sequelize
Baza podataka: PostgreSQL
API: Last.fm (planirana integracija)
Alati: pgAdmin4 za upravljanje bazom

**Setup**
Kloniraj repozitorij:git clone https://github.com/Powercommerce-Internship-2025/music-recommender-app.git
                     cd music-recommender-app


**Postavi PostgreSQL:**
Instaliraj PostgreSQL: sudo apt install postgresql
Kreiraj bazu: psql -U postgres -c "CREATE DATABASE music_db;"


**Backend:**
Kreiraj .env fajl u server/:DATABASE_URL=postgresql://postgres:password123@localhost:5432/music_db
JWT_SECRET=sakrijmehehe
PORT=5000


**Instaliraj i pokreni:**
cd server/
npm install
npm install --save-dev dotenv-cli
npx dotenv -e .env -- npx sequelize-cli db:migrate
npm start


**Frontend:**
Instaliraj i pokreni:
cd client/
npm install
npm run dev


**Upravljanje bazom:**
Instaliraj pgAdmin4
Poveži se na music_db s korisnikom postgres i lozinkom iz .env.



**Implementirane funkcionalnosti**

Autentifikacija: Registracija, prijava korisnika.
Baza podataka: PostgreSQL sa Sequelize modelom za korisnike.

**Sljedeći koraci**

Integracija Last.fm API-ja.
Implementacija kataloga albuma/izvođača i preporuka.

