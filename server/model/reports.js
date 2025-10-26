import { db } from '../db/connection.js';

const profitPerLocation = async (startDate, endDate, desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    const query = `
        SELECT LocationName, SUM(TotalAmount) AS TotalProfit
        FROM pos.Order
        WHERE OrderDate BETWEEN ? AND ?
        GROUP BY LocationName
        ORDER BY TotalProfit ${order};
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [startDate, endDate], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

const mostPopularItems = async (startDate, endDate, desc = false) => {
  const order = desc ? 'DESC' : 'ASC';
  const query = `
    SELECT MI.Name AS Name, COUNT(*) AS OrderCount
    FROM pos.\`Order\` AS O
    JOIN pos.Order_Item AS OI ON O.OrderID = OI.OrderID
    JOIN pos.Menu_Item  AS MI ON OI.MenuItemID = MI.MenuItemID
    WHERE O.OrderDate BETWEEN ? AND ?
    GROUP BY MI.Name
    ORDER BY OrderCount ${order};
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [startDate, endDate], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


 const employeePerformance = async (startDate, endDate, desc = false) => {
  const order = desc ? 'DESC' : 'ASC';
  const query = `
    SELECT
      E.FName,
      E.Lname AS LName,
      COUNT(O.OrderID)                         AS OrdersHandled,
      COALESCE(SUM(O.TotalAmount), 0)          AS TotalSales,
      COALESCE(SUM(TIMESTAMPDIFF(SECOND, T.ClockInTime, T.ClockOutTime)), 0) / 3600
                                               AS TotalHoursWorked
    FROM Staff AS E
    LEFT JOIN pos.\`Order\` AS O
           ON O.StaffID = E.StaffID
          AND O.OrderDate BETWEEN ? AND ?
    LEFT JOIN Timecard AS T
           ON T.StaffID = E.StaffID
          AND T.ClockOutTime IS NOT NULL
    GROUP BY E.StaffID, E.FName, E.Lname
    ORDER BY TotalSales ${order};
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [startDate, endDate], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export { profitPerLocation, mostPopularItems, employeePerformance };