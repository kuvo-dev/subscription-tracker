# Subscription Tracker Web App

A full-stack web application that helps users manage and track their digital subscriptions. Users can log services like Netflix, Spotify, or iCloud, monitor payment details, and keep track of monthly and yearly expenses in one centralized dashboard.

## Demo
> *Local project only. No live link currently.*

---

## Features
- ✅ Add, edit, and delete subscriptions
- 📊 Track monthly and yearly expenses
- 🔍 Sort by name, due date, price, or category
- 🧾 Modal-based form for clean user input
- 🗂️ Relational database schema with normalization
- 📈 Real-time statistics display

---

## Tech Stack

| Frontend       | Backend         | Database | Tools                   |
|----------------|------------------|----------|--------------------------|
| HTML, CSS, JS  | Node.js (Express) | MySQL    | Git, npm, MySQL Workbench |

---

## Folder Structure

```
project/
├── public/
│   ├── index.html
│   ├── home.html
│   ├── script.js
│   ├── style.css
│   ├── assets/ (e.g. icons, logos)
├── server.js
├── queries.js
├── package.json
├── database_schema.sql
└── README.md
```

---

## Database Schema

The MySQL database uses five core tables:
- `Users`
- `Subscription_Category`
- `Subscription_Plan`
- `Payment_Method`
- `Subscriptions`

Seed data is included in `database_schema.sql`.

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MySQL database
- Create the database using the script in `database_schema.sql`
- Default credentials in `server.js`:
  ```
  user: 'root'
  password: 'password'
  database: 'SubscriptionTracker'
  ```

### 4. Run the server
```bash
node server.js
```

Visit `http://localhost:3000` in your browser.

---

## Notes
- This project is not deployed yet
- Frontend uses vanilla JS (no frameworks)
- Designed as a learning project for full-stack fundamentals

---

## Author
**Kuvo Abillar**  
[LinkedIn](https://www.linkedin.com/in/kuvo)  
Email: kuvo.work.dev@gmail.com