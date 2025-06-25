# **Music Recommender App**

## **Installation Guide**

---

### 1. Clone the repository:

```bash
git clone https://github.com/Powercommerce-Internship-2025/music-recommender-app.git
cd music-recommender-app
```
---

### 2. Set up PostgreSQL Database:
Open your terminal and connect to PostgreSQL.  
Create a new database for the project:  

```bash
psql -U postgres -c "CREATE DATABASE music_db;"  
```
---

### 3. Configure backend:  
  Navigate to the server directory:  
  ```bash  
cd server/
touch .env      
   ```  

Add the following variables to the **.env** file (replace "your_username & your_password" with your password):    

```bash
DATABASE_URL=your_username://postgres:your_password@localhost:5432/music_db    
JWT_SECRET=secret    
PORT=5000  
```  
  
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
