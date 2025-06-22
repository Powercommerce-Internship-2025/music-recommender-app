# **Music Recommender App**

## **Installation Guide**

---

### 1. Clone the repository:

```bash
git clone https://github.com/Powercommerce-Internship-2025/music-recommender-app.git
cd music-recommender-app
```
---

### 2. Set up PostgreSQL Database:**
Open your terminal and connect to PostgreSQL.  
Create a new database for the project:  

```bash
psql -U postgres -c "CREATE DATABASE music_db;"  
```
---

### 3. Configure backend:  
  Navigate to the server directory: cd server/  
  Open **.env** file in the **server/** root and add the following environment variables.  
  Replace "password" with your actual PostgreSQL password.  
  
  **Install backend dependencies:**  
  ```bash
npm install
npm install --save-dev dotenv-cli  
```

  **Run the database migrations (see section below for more details):**
  ```bash
npx dotenv -e .env -- npx sequelize-cli db:migrate
```

**For undo migration (if necessary):**
```bash
npx dotenv -e .env -- npx sequelize-cli db:migrate:undo:all
```

---

### 4. Configure Frontend:  
In a new terminal, navigate to the client directory and install frontend dependencies:  

```bash
cd client/
npm install
```

---
