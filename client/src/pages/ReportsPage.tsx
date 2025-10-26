import { useMemo, useState } from "react";
import "./ReportsPage.css";

/* ========= Types ========= */
type ReportType = "locations" | "items" | "employees";
type Range = { from: string; to: string };
type OrderType = "in-person" | "online" | "delivery";

/* ========= Mock rows (delete later) ========= */
const SALES = [
  { date: "2025-10-19", locationId: 1, location: "Midtown", item: "Classic Burger", qty: 18, price: 8, labor: 48, employee: "Alicia M.", hours: 6, orderType: "in-person" as OrderType },
  { date: "2025-10-19", locationId: 2, location: "Campus",  item: "Loaded Fries",   qty: 22, price: 7, labor: 56, employee: "Diego R.",  hours: 7, orderType: "online" as OrderType },
  { date: "2025-10-20", locationId: 2, location: "Campus",  item: "Chicken Tacos",  qty: 25, price: 8, labor: 64, employee: "Diego R.",  hours: 8, orderType: "delivery" as OrderType },
  { date: "2025-10-20", locationId: 1, location: "Midtown", item: "Lemonade",       qty: 30, price: 3, labor: 40, employee: "Sam K.",     hours: 5, orderType: "in-person" as OrderType },
];

/* ========= Helpers ========= */
const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

/** Common row filtering used by all reports */
function getFilteredRows(range: Range, onlyLocation?: string, orderType?: "all" | OrderType, keyword?: string) {
  const kw = (keyword ?? "").trim().toLowerCase();
  return SALES.filter((r) => {
    if (!(r.date >= range.from && r.date <= range.to)) return false;
    if (onlyLocation && r.location !== onlyLocation) return false;
    if (orderType && orderType !== "all" && r.orderType !== orderType) return false;
    if (kw) {
      const hay = `${r.location} ${r.item} ${r.employee}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  });
}

/* ========= Compute functions (frontend only for now) ========= */
function computeMostProfitableLocation(
  range: Range,
  onlyLocation?: string,
  orderType?: "all" | OrderType,
  keyword?: string
) {
  const rows = getFilteredRows(range, onlyLocation, orderType, keyword);
  const byLoc: Record<string, { revenue: number; cost: number }> = {};
  rows.forEach(r => {
    const revenue = r.qty * r.price;
    const cost = r.labor; // placeholder: labor as cost
    byLoc[r.location] ??= { revenue: 0, cost: 0 };
    byLoc[r.location].revenue += revenue;
    byLoc[r.location].cost += cost;
  });
  return Object.entries(byLoc).map(([location, v]) => ({
    location,
    revenue: v.revenue,
    cost: v.cost,
    profit: v.revenue - v.cost,
    margin: v.revenue ? (v.revenue - v.cost) / v.revenue : 0,
  }));
}

function computeMostPopularItems(
  range: Range,
  onlyLocation?: string,
  orderType?: "all" | OrderType,
  keyword?: string
) {
  const rows = getFilteredRows(range, onlyLocation, orderType, keyword);
  const byItem: Record<string, { qty: number; revenue: number }> = {};
  rows.forEach(r => {
    const revenue = r.qty * r.price;
    byItem[r.item] ??= { qty: 0, revenue: 0 };
    byItem[r.item].qty += r.qty;
    byItem[r.item].revenue += revenue;
  });
  return Object.entries(byItem).map(([item, v]) => ({ item, ...v }));
}

function computeEmployeePerformance(
  range: Range,
  onlyLocation?: string,
  orderType?: "all" | OrderType,
  keyword?: string
) {
  const rows = getFilteredRows(range, onlyLocation, orderType, keyword);
  const byEmp: Record<string, { revenue: number; labor: number; hours: number; orders: number }> = {};
  rows.forEach(r => {
    const revenue = r.qty * r.price;
    byEmp[r.employee] ??= { revenue: 0, labor: 0, hours: 0, orders: 0 };
    byEmp[r.employee].revenue += revenue;
    byEmp[r.employee].labor += r.labor;
    byEmp[r.employee].hours += r.hours;
    byEmp[r.employee].orders += r.qty;
  });
  return Object.entries(byEmp).map(([employee, v]) => {
    const profit = v.revenue - v.labor;
    return {
      employee,
      hours: v.hours,
      orders: v.orders,
      revenue: v.revenue,
      profitPerHour: v.hours ? profit / v.hours : 0,
      avgTicket: v.orders ? v.revenue / v.orders : 0,
    };
  });
}

/* ========= Sort field options per report ========= */
const sortFieldsByType: Record<ReportType, { key: string; label: string }[]> = {
  locations: [
    { key: "location", label: "Location" },
    { key: "revenue",  label: "Revenue" },
    { key: "cost",     label: "Cost" },
    { key: "profit",   label: "Profit" },
    { key: "margin",   label: "Margin" },
  ],
  items: [
    { key: "item",    label: "Item" },
    { key: "qty",     label: "Quantity" },
    { key: "revenue", label: "Revenue" },
  ],
  employees: [
    { key: "employee",      label: "Employee" },
    { key: "revenue",       label: "Revenue" },
    { key: "profitPerHour", label: "Profit / Hour" },
    { key: "avgTicket",     label: "Avg Ticket" },
  ],
};

export default function ReportsPage() {
  /* ---- Default range (last 7 days) ---- */
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 6);
  const from = fromDate.toISOString().slice(0, 10);

  /* ---- Form state ---- */
  const [type, setType] = useState<ReportType>("locations");
  const [location, setLocation] = useState<string>("all");

  // universal filters
  const [orderType, setOrderType] = useState<"all" | OrderType>("all");
  const [keyword, setKeyword] = useState<string>("");

  const [range, setRange] = useState<Range>({ from, to });
  const [viewed, setViewed] = useState(false);

  /* ---- Sorting state ---- */
  const [sortField, setSortField] = useState<string>("profit"); // sensible default for locations
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /* ---- Derived rows (with sorting applied) ---- */
  /* Delete/Change Later*/
  const result = useMemo(() => {
    const loc = location === "all" ? undefined : location;
    let data: any[] = [];
    if (type === "locations") data = computeMostProfitableLocation(range, loc, orderType, keyword);
    else if (type === "items") data = computeMostPopularItems(range, loc, orderType, keyword);
    else data = computeEmployeePerformance(range, loc, orderType, keyword);

    // adjust default sort field on type change
    if (type === "locations" && !sortFieldsByType.locations.find(f => f.key === sortField)) {
      setSortField("profit");
    } else if (type === "items" && !sortFieldsByType.items.find(f => f.key === sortField)) {
      setSortField("qty");
    } else if (type === "employees" && !sortFieldsByType.employees.find(f => f.key === sortField)) {
      setSortField("profitPerHour");
    }

    const sorted = [...data].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [type, range, location, orderType, keyword, sortField, sortOrder]);

  /* ---- Actions ---- */
  const onView = () => setViewed(true);
  const onSavePDF = () => window.print();

  /* ========= View ========= */
  return (
    <div className="report-page">
      {/* FORM */}
      <div className="card">
        <h1 className="page-title">Report Request</h1>
        <h2 className="section-title">Activity Report</h2>

        <div className="form-grid">
          <label className="field span-2">
            <span>Report Type *</span>
            <select value={type} onChange={e => setType(e.target.value as ReportType)}>
              <option value="locations">Most Profitable Location</option>
              <option value="items">Most Popular Menu Item</option>
              <option value="employees">Employee Performance (Profit / Hour)</option>
            </select>
          </label>

          <label className="field">
            <span>Location</span>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="all">All</option>
              <option>Truck #1 • Midtown</option>
              <option>Truck #2 • Campus</option>
            </select>
          </label>

          {/* Order Type */}
          <label className="field">
            <span>Order Type</span>
            <select value={orderType} onChange={e => setOrderType(e.target.value as any)}>
              <option value="all">All Orders</option>
              <option value="in-person">In-person</option>
              <option value="online">Online</option>
            </select>
          </label>

          {/* Keyword Search */}
          <label className="field span-2">
            <span>Keyword</span>
            <input
              type="text"
              className="keyword-input"
              placeholder="Search item, employee, or location…"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Activity date from</span>
            <input
              type="date"
              value={range.from}
              onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
            />
          </label>

          <label className="field">
            <span>Activity date to</span>
            <input
              type="date"
              value={range.to}
              onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={onView}>View Report</button>
          <div className="save-split">
            <button className="btn btn-secondary" onClick={onSavePDF}>Save as PDF</button>
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      {viewed && (
        <div className="report-output card">
          <div className="report-header">
            <div className="report-title">Report Output</div>
            <div className="report-subtitle">
              {type === "locations" && "Most Profitable Location"}
              {type === "items" && "Most Popular Menu Item"}
              {type === "employees" && "Employee Performance (Profit / Hour)"}
            </div>
            <div className="report-meta">
              Range: {range.from} → {range.to} • Location: {location} • Orders: {orderType}
              {keyword.trim() ? <> • Filter: “{keyword}”</> : null}
            </div>
          </div>

          {/* Sort controls (single place, adapts by type) */}
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              {sortFieldsByType[type].map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
            <button
              className="btn btn-outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "🔼 Ascending" : "🔽 Descending"}
            </button>
          </div>

          {/* Tables */}
          {type === "locations" && (
            <table className="rtable">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Revenue</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {(result as any[]).map(r => (
                  <tr key={r.location}>
                    <td>{r.location}</td>
                    <td>{money(r.revenue)}</td>
                    <td>{money(r.cost)}</td>
                    <td>{money(r.profit)}</td>
                    <td>{Math.round(r.margin * 100)}%</td>
                  </tr>
                ))}
                <tr className="subtotal">
                  <td>Subtotal</td>
                  <td>{money((result as any[]).reduce((a, b) => a + b.revenue, 0))}</td>
                  <td>{money((result as any[]).reduce((a, b) => a + b.cost, 0))}</td>
                  <td>{money((result as any[]).reduce((a, b) => a + b.profit, 0))}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}

          {type === "items" && (
            <table className="rtable">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(result as any[]).map(r => (
                  <tr key={r.item}>
                    <td>{r.item}</td>
                    <td>{r.qty}</td>
                    <td>{money(r.revenue)}</td>
                  </tr>
                ))}
                <tr className="subtotal">
                  <td>Subtotal</td>
                  <td>{(result as any[]).reduce((a, b) => a + b.qty, 0)}</td>
                  <td>{money((result as any[]).reduce((a, b) => a + b.revenue, 0))}</td>
                </tr>
              </tbody>
            </table>
          )}

          {type === "employees" && (
            <table className="rtable">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Hours</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Profit / Hour</th>
                  <th>Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                {(result as any[]).map(r => (
                  <tr key={r.employee}>
                    <td>{r.employee}</td>
                    <td>{r.hours}</td>
                    <td>{r.orders}</td>
                    <td>{money(r.revenue)}</td>
                    <td>{money(r.profitPerHour)}</td>
                    <td>{money(r.avgTicket)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="report-footer">
            Generated on {new Date().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
