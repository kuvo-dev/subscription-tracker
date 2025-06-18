const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const queries = require('./queries');
require('dotenv').config();

const app = express();

// ===============================================
// MIDDLEWARE
// ===============================================
app.use(cors());
app.use(express.json()); // for parsing JSON bodies
app.use(express.static(path.join(__dirname, 'public')));

// Request logger
app.use((req, res, next) => {
  // console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// ===============================================
// DATABASE CONNECTION
// ===============================================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

// ===============================================
// STATIC ROUTES
// ===============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Serve home.html
app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'), (err) => {
    if (err) {
      console.error('Error sending home.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// ===============================================
// DATA ROUTES - READ
// ===============================================
app.get('/subscriptions', (req, res) => {
  const sortColumn = req.query.sort || 'Name'; // Default sort by Name
  
  // Use the consolidated query from queries.js
  let query = queries.getSubscriptions;
  
  // Add the ORDER BY clause only if a sort column is specified
  const orderClause = `ORDER BY ${sortColumn === 'Amount' ? 'CAST(Amount AS DECIMAL(10,2))' : sortColumn}`;
  query = query.replace('{{orderClause}}', orderClause);
  
  db.query(query, (err, result) => {
    if (err) {
      // console.error('Database query error:', err);
      res.status(500).send('Database error');
    } else {
      res.json(result);
    }
  });
});

// Get statistics (active count, monthly expenses, yearly expenses)
app.get('/statistics', (req, res) => {
  db.query(queries.getStatistics, (err, result) => {
    if (err) {
      // console.error('Database query error:', err);
      res.status(500).json({ error: err.message });
    } else {
      // Extract the first row as that contains all our statistics
      const stats = result[0] || { activeCount: 0, monthlyTotal: 0, yearlyTotal: 0 };
      
      // Ensure values are numbers and handle null values
      stats.activeCount = stats.activeCount || 0;
      stats.monthlyTotal = parseFloat(stats.monthlyTotal || 0).toFixed(2);
      stats.yearlyTotal = parseFloat(stats.yearlyTotal || 0).toFixed(2);
      
      res.json(stats);
    }
  });
});

// ===============================================
// DATA ROUTES - CREATE & UPDATE
// ===============================================
function addSubscription(req, res) {
  const {
    subscription_name,
    plan_name,
    plan_type,
    price,
    category_name,
    status,
    payment_provider,
    payment_type,
    last_four,
    due_day,
    full_name,
    email
  } = req.body;

  db.query(queries.insertUser, [full_name, email], (err, userResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const UID = userResult.insertId;

    db.query(queries.insertCategory, [category_name], (err, catResult) => {
      if (err) return res.status(500).json({ error: err.message });
      const CID = catResult.insertId;

      db.query(queries.insertPlan, [plan_name, plan_type, price], (err, planResult) => {
        if (err) return res.status(500).json({ error: err.message });
        const PLANID = planResult.insertId;

        db.query(queries.insertPayment, [UID, payment_type, payment_provider, last_four, due_day], (err, payResult) => {
          if (err) return res.status(500).json({ error: err.message });
          const PAYID = payResult.insertId;

          db.query(queries.insertSubscription, [UID, subscription_name, status, PAYID, PLANID, CID], (err, finalResult) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(200).json({ success: true, message: 'Subscription added successfully!' });
          });
        });
      });
    });
  });
}

// Add a new subscription
app.post('/add-subscription', (req, res) => {
  addSubscription(req, res);
});

// Update an existing subscription
app.put('/update-subscription/:name', (req, res) => {
  const oldName = req.params.name;
  
  // delete old subscription and reinsert
  db.query(queries.deleteSubscription, [oldName], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    addSubscription(req, res);
  });
});

// ===============================================
// DATA ROUTES - DELETE
// ===============================================
app.delete('/delete-subscription/:name', (req, res) => {
  const name = req.params.name;
  db.query(queries.deleteSubscription, [name], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// ===============================================
// SERVER STARTUP
// ===============================================
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});