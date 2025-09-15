import React from "react";
import logo from "../../assets/img/kmg-logo.svg";
import profile from "../../assets/img/profile-img.jpg";

const Header=() =>{
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }
  function toggle(){
    if (select('.toggle-sidebar-btn')) {
          select('body').classList.toggle('toggle-sidebar')
      }
  }

  return (
    <>
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center">
        <img src={logo} alt="KMG Logo" />
          <span className="d-none d-lg-block">Timesheet</span>
        </a>
        <i className="bi bi-list toggle-sidebar-btn" onClick={toggle}></i>
      </div>
      <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>
      <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown">
                    <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-bell"></i>
            <span className="badge bg-primary badge-number">4</span>
          </a>
          </li>
          
          {/* Messages */}
          <li className="nav-item dropdown">
          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-chat-left-text"></i>
            <span className="badge bg-success badge-number">3</span>
          </a>
          </li>
          
          {/* Profile */}
          <li className="nav-item dropdown pe-3">
          <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img src={profile} alt="Profile" className="rounded-circle" />
            <span className="d-none d-md-block dropdown-toggle ps-2">John Smith</span>
          </a>
          </li>
        </ul>
      </nav>
    </header>
    </>
  );
}

export default Header;
