import "./WelcomePageDD.css";
import {TopNav} from "../components/TopNav";

export default function WelcomePageDD() {

  return (
    <div className="welcome-container">
       <TopNav />
      <div className="welcome-card">
        <header className="welcome-header">
          <h1 className="welcome-title">Food Truck POS</h1>
          <p className="welcome-subtitle">🚚 Fresh • Fast • Friendly</p>
        </header>

        <main className="welcome-main">
          <div className="welcome-section">
            <div className="welcome-section-header">
              <svg className="welcome-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.25 8.5 15.5 8.5 15.5s8.5-10.25 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 11.5a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
              <h2>Location & Hours</h2>
            </div>
            <p>Houston, Texas</p>
            <p>Tue–Sun • 11:00 AM – 8:00 PM</p>
          </div>

          <div className="welcome-section">
            <div className="welcome-section-header">
               <svg className="welcome-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <h2>About Us</h2>
            </div>
            <p>
              We are CS students trying to survive Professor Uma class...
            </p>
          </div>
        </main>
        </div>
      <footer className="welcome-footer">
        © {new Date().getFullYear()} TEAM 4
      </footer>
    </div>
  );
}
