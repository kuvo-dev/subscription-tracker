const queries = {
  insertUser: `
    INSERT INTO Users (full_name, email)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE UID=LAST_INSERT_ID(UID)
  `,
  
  insertCategory: `
    INSERT INTO Subscription_Category (category_name)
    VALUES (?)
    ON DUPLICATE KEY UPDATE CID=LAST_INSERT_ID(CID)
  `,
  
  insertPlan: `
    INSERT INTO Subscription_Plan (plan_name, plan_type, price)
    VALUES (?, ?, ?)
  `,
  
  insertPayment: `
    INSERT INTO Payment_Method (UID, payment_type, payment_provider, last_four, due_day)
    VALUES (?, ?, ?, ?, ?)
  `,
  
  insertSubscription: `
    INSERT INTO Subscriptions (UID, subscription_name, status, PAYID, PLANID, CID)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  
  deleteSubscription: `
    DELETE FROM Subscriptions 
    WHERE subscription_name = ?
  `,
  
  // Consolidated query for getting subscriptions with optional sorting
  getSubscriptions: `
    SELECT 
      s.subscription_name AS Name,
      p.price AS Amount,
      p.plan_type AS Frequency,
      c.category_name AS Category,
      CONCAT(pm.payment_provider, ' - ', pm.payment_type) AS Card_Used,
      u.full_name AS User,
      pm.due_day AS Date_Due
    FROM Subscriptions s
    JOIN Users u ON s.UID = u.UID
    JOIN Payment_Method pm ON s.PAYID = pm.PAYID
    JOIN Subscription_Plan p ON s.PLANID = p.PLANID
    JOIN Subscription_Category c ON s.CID = c.CID
    {{orderClause}}
  `,
  
  // Get all statistics in a single call with improved readability
  getStatistics: `
    SELECT
      (
        SELECT COUNT(*) 
        FROM Subscriptions 
        WHERE status = 'ACTIVE'
      ) AS activeCount,
      
      IFNULL(
        (
          SELECT SUM(p.price) 
          FROM Subscriptions s 
          JOIN Subscription_Plan p ON s.PLANID = p.PLANID 
          WHERE s.status = 'ACTIVE' AND p.plan_type = 'MONTHLY'
        ), 
        0
      ) AS monthlyTotal,
      
      IFNULL(
        (
          SELECT SUM(p.price) 
          FROM Subscriptions s 
          JOIN Subscription_Plan p ON s.PLANID = p.PLANID 
          WHERE s.status = 'ACTIVE' AND p.plan_type = 'YEARLY'
        ), 
        0
      ) AS yearlyTotal
  `
};

module.exports = queries;