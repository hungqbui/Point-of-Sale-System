import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenuEm } from '../utils/fetchMenu';
import type { MenuItem } from '../types/MenuItem';
import { updateMenuItem } from '../utils/fetchMenu';
import { useToaster } from '../contexts/ToastContext';
import './Employee_Manager.css';

// SVG Icons as components
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UtilitiesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const InventoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Employee_Manager: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'utilities' | 'inventory'>('menu');
  
  const { addToast } = useToaster();

  // ---------------- MENU ITEMS LIST ----------------
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // ---------------- MENU ITEM FORM ----------------
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // ---------------- UTILITIES FORM ----------------
  const [paymentId, setPaymentId] = useState('');
  const [utilityType, setUtilityType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [utilityDate, setUtilityDate] = useState('');
  const [utilityLocation, setUtilityLocation] = useState('');
  const [utilitiesList, setUtilitiesList] = useState<any[]>([]);

  // ---------------- INVENTORY FORM ----------------
  const [supplierName, setSupplierName] = useState('');
  const [status, setStatus] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [showIngredients, setShowIngredients] = useState(false);
  const [receivedDate, setReceivedDate] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [inventoryList, setInventoryList] = useState<any[]>([]);

  const ingredients = [
    { name: 'Example French Toast', cost: 1.0 },
    { name: 'Example item1', cost: 1.0 },
    { name: 'Example Avocado', cost: 1.0 },
    { name: 'Example Fruit', cost: 1.0 },
    { name: 'Example meat', cost: 1.0 },
  ];

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (activeTab === 'menu') {
      loadMenuItems();
    }
    
    fetch('/api/utilities')
      .then(res => res.json())
      .then(data => {setUtilitiesList(data), console.log('✅ Utilities fetch response:', data);})
      .catch(err => console.error('❌ Utilities fetch error:', err));

    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => setInventoryList(data))
      .catch(err => console.error('❌ Inventory fetch error:', err));
  }, [activeTab]);

  // ---------------- LOAD MENU ITEMS ----------------
  const loadMenuItems = async () => {
    setIsLoadingMenu(true);
    try {
      const items = await fetchMenuEm();
      setMenuItems(items);
    } catch (err) {
      console.error('❌ Error loading menu items:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // ---------------- OPEN FORM FOR EDITING/ADDING ----------------
  const openMenuForm = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.Name);
      setItemDescription(item.Description);
      setItemPrice(item.Price);
      setCategory(item.Category);
      setAvailable(item.Availability === 1);
    } else {
      setEditingItem(null);
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setCategory('');
      setAvailable(true);
    }
    setShowMenuForm(true);
    setSaveMessage('');
  };

  const closeMenuForm = () => {
    setShowMenuForm(false);
    setEditingItem(null);
    setSaveMessage('');
  };

  // ---------------- MENU ITEM SAVE ----------------
  const isFormValid = Boolean(
    itemName.trim() &&
      itemDescription.trim() &&
      parseFloat(itemPrice) > 0 &&
      category.trim()
  );

  const handleSave = async () => {
    if (!isFormValid) return;
    setIsSaving(true);
    setSaveMessage('');

    let itemData : any = {
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      category,
      available,
    };

    if (editingItem) {
      itemData.id = editingItem.MenuItemID;
    }

    try {
      const data = await updateMenuItem(itemData);

      console.log('✅ Saved menu item:', data);
      setSaveMessage(editingItem ? '✔ Menu item updated successfully!' : '✔ Menu item created successfully!');
      
      // Reload menu items and close form after short delay
      setTimeout(() => {
        loadMenuItems();
        closeMenuForm();
      }, 1500);
      addToast('✅ Saved menu item ' + data.item.Name, "info");
    } catch (err) {
      addToast('❌ Failed to save item. Check console.', 'error');
      console.error('❌ Error saving item:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- UTILITIES SAVE ----------------
  const handleSaveUtilityPayment = async () => {
    try {
      const payload = {
        paymentId,
        type: utilityType,
        totalAmount: parseFloat(totalAmount),
        date: utilityDate,
        locationName: utilityLocation,
      };

      const res = await fetch('/api/utilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log('✅ Utility payment saved:', data);
      alert('Utility payment saved successfully!');

      setPaymentId('');
      setUtilityType('');
      setTotalAmount('');
      setUtilityDate('');
      setUtilityLocation('');

      const refreshed = await fetch('/api/utilities');
      const updatedList = await refreshed.json();
      setUtilitiesList(updatedList);
    } catch (err) {
      console.error('❌ Error saving utility payment:', err);
      alert('Failed to save utility payment. Check console.');
    }
  };

  // ---------------- INVENTORY SAVE ----------------
  const handleSaveInventoryOrder = async () => {
    try {
      const payload = {
        supplierName,
        status,
        locationName,
        ingredientItem: selectedIngredient || 'Example Ingredient',
        receivedDate,
        costPerUnit: parseFloat(costPerUnit),
        quantity: parseInt(quantity),
      };

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log('✅ Inventory order saved:', data);
      alert('Inventory order saved successfully!');

      setSupplierName('');
      setStatus('');
      setLocationName('');
      setSelectedIngredient('');
      setReceivedDate('');
      setCostPerUnit('');
      setQuantity('');

      const refreshed = await fetch('/api/inventory');
      const updatedList = await refreshed.json();
      setInventoryList(updatedList);
    } catch (err) {
      console.error('❌ Error saving inventory order:', err);
      alert('Failed to save inventory order. Check console.');
    }
  };

  // ---------------- COMPONENT UI ----------------
  return (
    <div className="employee-manager-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Manager Portal</h1>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-button ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <MenuIcon />
            <span>Menu Items</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'utilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('utilities')}
          >
            <UtilitiesIcon />
            <span>Utilities</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <InventoryIcon />
            <span>Inventory</span>
          </button>
          <button
            className="sidebar-button home-button"
            onClick={() => navigate('/')}
          >
            <HomeIcon />
            <span>Home</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* -------------------- MENU TAB -------------------- */}
        {activeTab === 'menu' && (
          <div>
            <div className="page-header">
              <h1 className="page-title">Menu Items</h1>
              <p className="page-subtitle">Manage your restaurant's menu items</p>
            </div>

            {isLoadingMenu ? (
              <div className="loading-spinner">Loading menu items...</div>
            ) : (
              <div className="menu-items-grid">
                {menuItems.map((item) => (
                  <div
                    key={item.MenuItemID}
                    className="menu-item-card"
                    onClick={() => openMenuForm(item)}
                  >
                    <div className="menu-item-image">
                      {item.ImageURL ? (
                        <img src={item.ImageURL} alt={item.Name} />
                      ) : (
                        <div className="menu-item-placeholder">📷</div>
                      )}
                    </div>
                    <div className="menu-item-details">
                      <p className="menu-item-description">{item.Name}</p>
                      <div className="menu-item-footer">
                        <span className="menu-item-price">${parseFloat(item.Price).toFixed(2)}</span>
                        <span className={`menu-item-badge ${item.Availability === 1 ? 'available' : 'unavailable'}`}>
                          {item.Availability === 1 ? '✓ Available' : '✗ Unavailable'}
                        </span>
                      </div>
                      <span className="menu-item-category">{item.Category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Button - Fixed Bottom Right */}
            <button className="add-menu-item-btn" onClick={() => openMenuForm()}>
              <PlusIcon style={{ width: '24px', height: '24px' }} />
            </button>

            {/* Modal Form */}
            {showMenuForm && (
              <div className="modal-overlay" onClick={closeMenuForm}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}</h2>
                    <button className="modal-close" onClick={closeMenuForm}>
                      <CloseIcon style={{ width: '24px', height: '24px' }} />
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="image-placeholder">
                      <p>📷 Image Placeholder - Click to upload</p>
                    </div>

                    <div className="form-group">
                      <label>Item Name:</label>
                      <input
                        type="text"
                        value={itemName}
                        onChange={e => setItemName(e.target.value)}
                        placeholder="Enter item name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Item Description:</label>
                      <textarea
                        value={itemDescription}
                        onChange={e => setItemDescription(e.target.value)}
                        placeholder="Describe your menu item"
                      />
                    </div>

                    <div className="form-group">
                      <label>Item Price:</label>
                      <input
                        type="number"
                        value={itemPrice}
                        onChange={e => setItemPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Category:</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Select category</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="entree">Entree</option>
                        <option value="dessert">Dessert</option>
                        <option value="beverage">Beverage</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <div className="checkbox-group">
                        <label>Available:</label>
                        <input
                          type="checkbox"
                          checked={available}
                          onChange={() => setAvailable(!available)}
                        />
                        <span>{available ? '✓ Available' : '✗ Sold Out'}</span>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={() => handleSave()}
                      disabled={!isFormValid || isSaving}
                    >
                      {isSaving ? 'Saving...' : editingItem ? 'Update Menu Item' : 'Create Menu Item'}
                    </button>

                    {saveMessage && (
                      <div className={`save-message ${saveMessage.includes('✔') ? 'success' : 'error'}`}>
                        {saveMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- UTILITIES TAB -------------------- */}
        {activeTab === 'utilities' && (
          <div className="form-container">
            <div className="page-header">
              <h1 className="page-title">Utilities Management</h1>
              <p className="page-subtitle">Track and manage utility payments across locations</p>
            </div>

            <div className="content-card">
              <h2>Add Utility Payment</h2>

              <div className="form-group">
                <label>Payment ID:</label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={e => setPaymentId(e.target.value)}
                  placeholder="Enter payment ID"
                />
              </div>

              <div className="form-group">
                <label>Type:</label>
                <select value={utilityType} onChange={e => setUtilityType(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="water">Water</option>
                  <option value="electricity">Electricity</option>
                  <option value="gas">Gas</option>
                  <option value="internet">Internet</option>
                  <option value="phone">Phone</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={utilityLocation}
                  onChange={e => setUtilityLocation(e.target.value)}
                  placeholder="Enter location name"
                />
              </div>

              <div className="form-group">
                <label>Total Amount:</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={e => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={utilityDate}
                  onChange={e => setUtilityDate(e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={handleSaveUtilityPayment}>
                Save Utility Payment
              </button>

              {/* Display saved utilities */}
              {utilitiesList.length > 0 && (
                <>
                  <hr className="section-divider" />
                  <h2>Saved Utility Payments</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Payment ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Location</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {utilitiesList.map((u, i) => (
                        <tr key={i}>
                          <td>{u.paymentId}</td>
                          <td style={{ textTransform: 'capitalize' }}>{u.type}</td>
                          <td>${parseFloat(u.amount).toFixed(2)}</td>
                          <td>{u.locationName ?? '—'}</td>
                          <td>{u.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}

        {/* -------------------- INVENTORY TAB -------------------- */}
        {activeTab === 'inventory' && (
          <div className="form-container">
            <div className="page-header">
              <h1 className="page-title">Inventory Management</h1>
              <p className="page-subtitle">Create and track inventory orders</p>
            </div>

            <div className="content-card">
              <h2>Create Inventory Order</h2>

              <div className="form-group">
                <label>Supplier Name:</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location Name:</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="Enter location name"
                />
              </div>

              <div className="form-group">
                <label>Ingredient Item:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Select Ingredient"
                    value={selectedIngredient}
                    onClick={() => setShowIngredients(!showIngredients)}
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                  {showIngredients && (
                    <div className="dropdown-menu">
                      {ingredients.map((item, i) => (
                        <div
                          key={i}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedIngredient(item.name);
                            setShowIngredients(false);
                          }}
                        >
                          <span className="dropdown-item-name">{item.name}</span>
                          <span className="dropdown-item-cost">+${item.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Shipment Received Date:</label>
                <input
                  type="date"
                  value={receivedDate}
                  onChange={e => setReceivedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Cost per Unit:</label>
                <input
                  type="number"
                  value={costPerUnit}
                  onChange={e => setCostPerUnit(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Quantity Resupply:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>

              <button className="btn-primary" onClick={handleSaveInventoryOrder}>
                Save Inventory Order
              </button>

              {/* Display saved inventory orders */}
              {inventoryList.length > 0 && (
                <>
                  <hr className="section-divider" />
                  <h2>Saved Inventory Orders</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Item</th>
                        <th>Cost/Unit</th>
                        <th>Qty</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryList.map((o, i) => (
                        <tr key={i}>
                          <td>{o.supplierName}</td>
                          <td style={{ textTransform: 'capitalize' }}>{o.status}</td>
                          <td>{o.locationName}</td>
                          <td>{o.ingredientItem}</td>
                          <td>${parseFloat(o.costPerUnit).toFixed(2)}</td>
                          <td>{o.quantity}</td>
                          <td>{o.receivedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Employee_Manager;
