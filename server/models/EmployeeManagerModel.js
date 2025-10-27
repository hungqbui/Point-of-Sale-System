import { db } from '../db/connection.js';


async function ensureColumns(tableName, columnDefinitions) {
  const [rows] = await db.query(
    `
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
    `,
    [tableName]
  );

  const existing = new Set(rows.map(row => row.COLUMN_NAME.toLowerCase()));

  for (const definition of columnDefinitions) {
    const columnName = definition.split(/\s+/)[0];
    if (!existing.has(columnName.toLowerCase())) {
      await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`);
    }
  }
}

/**
 * Creates the utility_payment table when it does not already exist.
 * The schema mirrors the fields used in Employee_Manager.tsx.
 */
async function ensureUtilityPaymentTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS utility_payment (
      UtilityPaymentID INT AUTO_INCREMENT PRIMARY KEY,
      PaymentDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureColumns('utility_payment', [
    'PaymentCode VARCHAR(64) UNIQUE',
    'PaymentDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
    'CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'Type ENUM(\'water\', \'electricity\', \'gas\', \'other\') DEFAULT \'other\'',
    'TotalAmount DECIMAL(10,2) NOT NULL DEFAULT 0.00',
    'Amount DECIMAL(10,2) NOT NULL DEFAULT 0.00',
    'UtilityType ENUM(\'electricity\', \'water\', \'gas\', \'internet\', \'phone\', \'other\') DEFAULT \'other\'',
    'LocationName VARCHAR(120)'
  ]);
}

/**
 * Creates the inventory_order table when it does not already exist.
 * This table stores the management inventory orders captured in the UI.
 */
async function ensureInventoryOrderTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS inventory_shipment (
      ShipmentID INT NOT NULL AUTO_INCREMENT,
      IngredientID INT,
      QuantityReceived INT,
      ShipmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      Status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
      Cost DECIMAL(10,2),
      SupplierName VARCHAR(255),
      PRIMARY KEY (ShipmentID),
      KEY (IngredientID)
    )
  `);

  await ensureColumns('inventory_shipment', [
    'IngredientID INT',
    'QuantityReceived INT',
    "ShipmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "Status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending'",
    'Cost DECIMAL(10,2)',
    'SupplierName VARCHAR(255)'
  ]);
}

/**
 * Fetches menu items from the persistent menu_item table.
 * @returns {Promise<Array>} Menu items formatted for the frontend.
 */
export async function fetchMenuItems() {
  const [rows] = await db.query(
    `
      SELECT
        MenuItemID AS id,
        Name AS name,
        Description AS description,
        Price AS price,
        ImageURL AS imageUrl,
        Category AS category,
        Availability AS availability
      FROM menu_item
      ORDER BY MenuItemID DESC
    `
  );

  return rows.map(row => ({
    ...row,
    availability: Boolean(row.availability)
  }));
}

/**
 * Inserts a new menu item into the menu_item table.
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {number} payload.price
 * @param {string} payload.category
 * @param {boolean} payload.available
 * @returns {Promise<Object>} Newly created menu item data.
 */
export async function createMenuItem(payload) {
  const {
    name,
    description,
    price,
    category,
    available
  } = payload;

  const categoryMap = {
    food: 'entree',
    entree: 'entree',
    drink: 'beverage',
    beverage: 'beverage',
    dessert: 'dessert'
  };

  const normalizedCategory =
    (category && categoryMap[category.toLowerCase()]) || category || 'entree';

  const [result] = await db.execute(
    `
      INSERT INTO menu_item (Name, Description, Price, Category, Availability)
      VALUES (?, ?, ?, ?, ?)
    `,
    [name, description, price, normalizedCategory, available ? 1 : 0]
  );

  return {
    id: result.insertId,
    name,
    description,
    price,
    category: normalizedCategory,
    availability: Boolean(available)
  };
}

/**
 * Returns all utility payments stored in the database.
 * @returns {Promise<Array>}
 */
export async function fetchUtilityPayments() {
  await ensureUtilityPaymentTable();

  const [rows] = await db.query(
    `
      SELECT
        UtilityPaymentID AS id,
        COALESCE(PaymentCode, PaymentID) AS paymentId,
        COALESCE(UtilityType, Type) AS type,
        TotalAmount AS totalAmount,
        LocationName AS locationName,
        DATE_FORMAT(PaymentDate, '%Y-%m-%d') AS date,
        CreatedAt AS createdAt
      FROM utility_payment
      ORDER BY PaymentDate DESC, UtilityPaymentID DESC
    `
  );

  return rows;
}

/**
 * Saves a utility payment captured from the management UI.
 * @param {Object} payload
 * @param {string} payload.paymentId
 * @param {string} payload.type
 * @param {number} payload.totalAmount
 * @param {string} payload.date - ISO (YYYY-MM-DD) date string.
 * @returns {Promise<Object>}
 */
export async function createUtilityPayment(payload) {
  await ensureUtilityPaymentTable();

  const paymentCode = payload.paymentId || `P-${Date.now()}`;
  const type = (payload.type || 'other').toLowerCase();
  const storageType = ['water', 'electricity', 'gas'].includes(type) ? type : 'other';
  const utilityTypeOptions = new Set(['water', 'electricity', 'gas', 'internet', 'phone', 'other']);
  const utilityType = utilityTypeOptions.has(type) ? type : 'other';
  const totalAmount = Number(payload.totalAmount ?? 0);
  const date = payload.date
    ? new Date(payload.date).toISOString().slice(0, 19).replace('T', ' ')
    : new Date().toISOString().slice(0, 19).replace('T', ' ');
  const locationName = payload.locationName || null;

  const [result] = await db.execute(
    `
      INSERT INTO utility_payment (PaymentCode, Type, TotalAmount, PaymentDate, Amount, UtilityType, LocationName)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Type = VALUES(Type),
        TotalAmount = VALUES(TotalAmount),
        PaymentDate = VALUES(PaymentDate),
        Amount = VALUES(Amount),
        UtilityType = VALUES(UtilityType),
        LocationName = VALUES(LocationName)
    `,
    [paymentCode, storageType, totalAmount, date, totalAmount, utilityType, locationName]
  );

  return {
    id: result.insertId || null,
    paymentId: paymentCode,
    type: utilityType,
    totalAmount,
    date,
    locationName
  };
}

/**
 * Fetches inventory orders for display on the management tab.
 * @returns {Promise<Array>}
 */
export async function fetchInventoryOrders() {
  await ensureInventoryOrderTable();

  const [rows] = await db.query(
    `
      SELECT
        s.ShipmentID AS id,
        s.SupplierName AS supplierName,
        s.Status AS status,
        s.Cost AS costPerUnit,
        s.QuantityReceived AS quantity,
        DATE_FORMAT(s.ShipmentDate, '%Y-%m-%d') AS receivedDate,
        s.IngredientID AS ingredientId,
        i.Name AS ingredientName
      FROM inventory_shipment s
      LEFT JOIN ingredient i ON s.IngredientID = i.IngredientID
      ORDER BY s.ShipmentDate DESC, s.ShipmentID DESC
    `
  );

  return rows.map(row => ({
    id: row.id,
    supplierName: row.supplierName || '',
    status: row.status,
    locationName: null,
    ingredientItem: row.ingredientName || (row.ingredientId ? `Ingredient #${row.ingredientId}` : 'Unknown'),
    costPerUnit: row.costPerUnit ?? 0,
    quantity: row.quantity ?? 0,
    receivedDate: row.receivedDate
  }));
}

/**
 * Persists an inventory order coming from the UI.
 * @param {Object} payload
 * @param {string} payload.supplierName
 * @param {string} payload.status
 * @param {string} payload.locationName
 * @param {string} payload.ingredientItem
 * @param {number} payload.costPerUnit
 * @param {number} payload.quantity
 * @param {string} payload.receivedDate - ISO (YYYY-MM-DD) date string.
 * @returns {Promise<Object>}
 */
export async function createInventoryOrder(payload) {
  await ensureInventoryOrderTable();

  const {
    supplierName,
    status,
    locationName,
    ingredientItem,
    costPerUnit,
    quantity,
    receivedDate
  } = payload;

  let ingredientId = null;
  if (ingredientItem) {
    const [ingredientRows] = await db.execute(
      'SELECT IngredientID FROM ingredient WHERE Name = ? LIMIT 1',
      [ingredientItem]
    );
    if (Array.isArray(ingredientRows) && ingredientRows.length > 0) {
      const row = ingredientRows[0];
      ingredientId = row?.IngredientID ?? null;
    }
  }

  const normalizedStatus = ['pending', 'received', 'cancelled'].includes(status ?? '')
    ? status
    : (status === 'delayed' ? 'pending' : 'pending');

  const shipmentDate = receivedDate
    ? new Date(receivedDate).toISOString().slice(0, 19).replace('T', ' ')
    : null;

  const [result] = await db.execute(
    `
      INSERT INTO inventory_shipment
        (SupplierName, Status, IngredientID, Cost, QuantityReceived, ShipmentDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      supplierName,
      normalizedStatus || 'pending',
      ingredientId,
      Number(costPerUnit ?? 0),
      Number(quantity ?? 0),
      shipmentDate
    ]
  );

  return {
    id: result.insertId,
    supplierName,
    status: normalizedStatus || 'pending',
    locationName: locationName || null,
    ingredientItem,
    costPerUnit: Number(costPerUnit ?? 0),
    quantity: Number(quantity ?? 0),
    receivedDate: receivedDate || null
  };
}
