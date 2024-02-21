import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import toastContext from '../../CONTEXT/context/toastContext';
import Spinner from '../Spinner';

export default function SellerLogin() {
  const context = useContext(toastContext);
  const { showToast } = context;
  const [sellerCredentials, setSellerCredentials] = useState({ email: '', password: '' });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/agency/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: sellerCredentials.email, password: sellerCredentials.password })
    });

    try {
      const json = await response.json();
      setProcessing(false);
      if (json.success) {
        localStorage.setItem('sellerToken', json.authToken);
        localStorage.setItem('agencyName', json.agencyName);
        navigate('/add-car');
      } else {
        navigate('/agency-login');
        window.scrollTo(0, 0);
        showToast('Invalid Credentials', 'error');
      }
    } catch (error) {
      console.log(error);
    }

  }
  const onChange = (e) => {
    setSellerCredentials({ ...sellerCredentials, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      navigate('/');
    } else if (localStorage.getItem('sellerToken')) {
      navigate('/add-car');
    }
  }, []);

  return (
    <>
      <div className="container margin-top-lg py-4 margin-top-80">
        <div className="row">
          <div className=" col-lg-3 col-sm-0"></div>
          <div className=" col-lg-6 col-sm-12 mini-container">
            <h1>Agency Login</h1>
            <form className='form-group mt-4'>
              <label className=' fs-4 mt-1' >Email</label>
              <input type='email' onChange={onChange} value={sellerCredentials.email} name='email' autoComplete="username" className='form-control input-field fs-5' />
              <label className=' fs-4 mt-1 ' >Password</label>
              <input type='password' onChange={onChange} value={sellerCredentials.password} name='password' autoComplete="password" className='form-control input-field fs-5' />
              <p className='mt-3'>Don't have a agency account<Link to='/agency-register'><small className='text-danger bold'> Register Agency</small></Link></p>
              <button onClick={handleLogin} className='btn btn-dark form-control mt-1 fs-4 bold  '>
                {processing === true ? <Spinner height='30' width='30' /> : 'Login'}
              </button>
            </form>
          </div>
          <div className=" col-lg-3 col-sm-0"></div>
        </div>
      </div>
    </>
  )
}
