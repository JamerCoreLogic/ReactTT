import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Sidebar=()=> {
  const pathname = useLocation().pathname
  const isActive = (path) => pathname === path;
  const isOpen = (path) => pathname.includes(path);
  
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link
            className={`nav-link collapsed ${isActive("/") ? "active" : ""}`}
            to="/"
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link collapsed ${isActive("/project") ? "active" : ""}`}
            to="/project"
          >
            <i className="bi bi-suitcase-lg"></i>
            <span>Projects</span>
          </Link>
        </li>
        <li className="nav-item">
           <Link
            className={`nav-link collapsed ${isActive("/task") ? "active" : ""}`} to="/task">
            <i className="bi bi-list-task"></i>
            <span>Tasks</span>
          </Link>
        </li>
        <li className="nav-item">
           <Link
            className={`nav-link collapsed ${isActive("/milestone") ? "active" : ""}`} to="/milestone">
            <i className="bi bi-flag-fill"></i>
            <span>Milestones</span>
          </Link>
        </li>
        <li className="nav-item">
           <Link
            className={`nav-link collapsed ${isActive("/timesheet") ? "active" : ""}`} to="/timesheet">
            <i className="bi bi-clock-fill"></i>
            <span>Timesheets</span>
          </Link>
        </li>
        <li className="nav-item">
           <Link
            className={`nav-link collapsed ${isActive("/calendar") ? "active" : ""}`} to="/calendar">
            <i className="bi bi-calendar"></i>
            <span>Calendar</span>
          </Link>
        </li>
        <li className="nav-item">
           <Link
            className={`nav-link collapsed ${isActive("/notification") ? "active" : ""}`} to="/notifications">
            <i className="bi bi-bell-fill"></i>
            <span>Notifications</span>
          </Link>
        </li>
        <li className="nav-item">
              <Link
                className={`nav-link ${isOpen("/client") ? "activeOpen" : "collapsed"
                  }`}
                data-bs-target="#setting-nav"
                data-bs-toggle="collapse"
                to=""
              >
                <i className="bi bi-gear-fill"></i>
                <span>Settings</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </Link>
              <ul
                id="setting-nav"
                className={`nav-content collapse  ${isOpen("/client") ? "show" : ""}`}
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link
                    className={`${isActive("/client") ? "active" : ""}`}
                    to="/client"
                  >
                    <i className="bi bi-circle"></i>
                    <span>Client</span>
                  </Link>
                </li>    
              </ul>
            </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
