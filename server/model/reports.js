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

<<<<<<< HEAD
    const [results] = await db.query(query, [startDate, endDate]);
    return results;
}

const mostPopularItems = async (startDate, endDate, desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    const query = `
        SELECT MI.Name, COUNT(OI.MenuItemID) AS OrderCount
        FROM pos.Order as O, pos.Menu_Item as MI, pos.Order_Item as OI
        WHERE O.OrderID = OI.OrderID AND OI.MenuItemID = MI.MenuItemID AND O.OrderDate BETWEEN ? AND ?
        GROUP BY MI.Name
        ORDER BY OrderCount ${order};
    `;

    const [results] = await db.query(query, [startDate, endDate]);
    return results;
}

const employeePerformance = async (startDate, endDate, desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    const query = `
        SELECT E.FName, E.lname,  COUNT(O.OrderID) AS OrdersHandled, SUM(O.TotalAmount) AS TotalSales, SUM(T.ClockOutTime - T.ClockInTime) AS TotalHoursWorked
        FROM Staff AS E
        JOIN Order AS O ON E.StaffID = O.StaffID
        JOIN Timecard as T ON T.StaffID = E.StaffID
        WHERE  T.StaffID = E.StaffID AND  T.ClockOutTime is NOT NULL
        GROUP BY (E.StaffID)
        ORDER BY TotalSales ${order};
    `;

    const [results] = await db.query(query, [startDate, endDate, startDate, endDate]);
    return results;
}   

mostPopularItems(new Date('2025-10-21'), new Date('2025-10-22'), true)
.then(results => console.log('Profit Per Location:', results))
=======
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
>>>>>>> DiegoDominguez

export { profitPerLocation, mostPopularItems, employeePerformance };