import db from '../db.js';

const profitPerLocation = async (startDate, endDate, desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    const query = `
        SELECT Location, SUM(TotalAmount) AS TotalProfit
        FROM pos.Orders
        WHERE OrderDate BETWEEN ? AND ?
        GROUP BY Location
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
        SELECT MI.Name, COUNT(OI.MenuItemID) AS OrderCount
        FROM pos.Orders as O, pos.Menu_Item as MI, pos.Order_Items as OI
        WHERE O.ID = OI.OrderID AND OI.MenuItemID = MI.ID AND O.OrderDate BETWEEN ? AND ?
        GROUP BY MI.Name
        ORDER BY OrderCount ${order};
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

const employeePerformance = async (startDate, endDate, desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    const query = `
        SELECT E.Name, COUNT(O.ID) AS OrdersHandled, SUM(O.TotalAmount) AS TotalSales, SUM(T.ClockOutTime - T.ClockInTime) AS TotalHoursWorked
        FROM pos.Employees AS E, pos.Timecard as T
        JOIN pos.Orders AS O ON E.ID = O.EmployeeID
        WHERE O.OrderDate BETWEEN ? AND ? AND T.StaffID = E.ID AND T.ClockInTime BETWEEN ? AND ? AND T.ClockOutTime is NOT NULL
        GROUP BY E.Name
        ORDER BY TotalSales ${order};
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [startDate, endDate, startDate, endDate], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}   

export { profitPerLocation, mostPopularItems, employeePerformance };