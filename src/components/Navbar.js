import React from 'react';
import '../styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const customerToken = localStorage.getItem('userToken');
  const agencyToken = localStorage.getItem('sellerToken');
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userToken');
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('agencyName');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('carId');
    navigate('/');
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand logo-sales-app" href="/">&nbsp;<strong>apna<span className='logo-app'>Car</span></strong></a>
          <button className="navbar-toggler bg-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse px-5" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">

              <Link className='navbar-item-link btn btn-bg border-0' to="/">
                <li className="nav-item text-black ">HOMEPAGE</li>
              </Link>
              {customerToken && <Link className='navbar-item-link btn btn-bg border-0' to="/booking-page">
                <li className="nav-item text-black ">MY BOOKINGS</li>
              </Link>}
              {agencyToken && <Link className='navbar-item-link btn btn-bg border-0' to="/get-orders">
                <li className="nav-item text-black ">BOOKING ORDERS</li>
              </Link>}
              {agencyToken && <Link className='navbar-item-link btn btn-bg border-0' to="/get-my-cars">
                <li className="nav-item text-black ">MY CARS</li>
              </Link>}

              {agencyToken && <Link className='navbar-item-link btn btn-bg border-0' to="/add-car">
                <li className="nav-item text-black ">ADD CAR</li>
              </Link>}

              {
                (!customerToken && !agencyToken) &&
                <Link className='navbar-item-link btn btn-bg border-0' to='/customer-login'>
                  <li className="nav-item login-black">CUSTOMER LOGIN</li>
                </Link>
              }
              {(!customerToken && !agencyToken) && <Link className='navbar-item-link btn-bg border-0 btn' to='/agency-login'>
                <li className="nav-item text-black">CAR RENTAL AGENCY</li>
              </Link>}

              {(customerToken || agencyToken) &&
                <button onClick={handleLogout} className='navbar-item-link btn border border-danger logout-btn'>
                  <li className="nav-item text-danger">LOGOUT</li>
                </button>}

            </ul>
            {customerToken && <span className='text-light fs-4'>{localStorage.getItem('userFullName')}</span>}
            {agencyToken && <span className='text-light fs-4'>{localStorage.getItem('agencyName')}</span>}

          </div>

        </div>
      </nav>
    </>
  )
}
