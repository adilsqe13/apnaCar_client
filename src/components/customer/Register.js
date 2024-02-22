import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toastContext from '../../CONTEXT/context/toastContext';
import Spinner from '../Spinner';

export default function Register() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const context = useContext(toastContext);
  const { showToast } = context;
  const [userCredentials, setuserCredentials] = useState({ fullName: '', email: '', password: '', mobile: '', address: '', state: '', postalCode: '' });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const handleRegister = async (e) => { 
    e.preventDefault();
    setProcessing(true);
    const response = await fetch(`${apiUrl}/api/auth/user/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: userCredentials.fullName,
        email: userCredentials.email,
        password: userCredentials.password,
        mobile: userCredentials.mobile,
        address: userCredentials.address,
        city: userCredentials.city,
        state: userCredentials.state,
        postalCode: userCredentials.postalCode,
      })
    });
    try {
      const json = await response.json();
      setProcessing(false);
      if (json.authToken) {
        localStorage.setItem('userToken', json.authToken);
        localStorage.setItem('userFullName', json.userFullName);
        navigate('/');
        window.scrollTo(0, 0);
        showToast('Registered Succesfully', 'success');
      } else {
        navigate('/customer-signup');
        const errorMsg = await json.error;
        showToast(errorMsg, 'warn');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onChange = (e) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      //   navigate('/allProducts');
      window.scrollTo(0, 0);
    } else if (localStorage.getItem('sellerToken')) {
      //   navigate('/seller-addProduct');
    }
  }, []);
  return (
    <>
      <div className="container margin-top-md pb-5 mt-5">
        <div className="row">
          <div className=" col-lg-3 col-sm-0"></div>
          <div className=" col-lg-6 col-sm-12 mini-container">
            <h1 className=''>Customer Sign-Up</h1>
            <form className='form-group mt-4'>
              <label className=' fs-4 mt-0' >Full Name</label>
              <input type='text' onChange={onChange} value={userCredentials.fullName} name='fullName' className='form-control input-field fs-6' placeholder='Enter your full name' />
              <label className=' fs-4 mt-0 ' >Email</label>
              <input type='email' onChange={onChange} value={userCredentials.email} name='email' autoComplete="username" className='form-control input-field fs-6' placeholder='example@gmail.com' />
              <label className=' fs-4 mt-0 ' >Password</label>
              <input type='password' onChange={onChange} value={userCredentials.password} name='password' autoComplete="password" className='form-control input-field fs-6' placeholder='******' />
              <label className=' fs-4 mt-0 ' >Mobile Number</label>
              <input type='tel' onChange={onChange} value={userCredentials.mobile} name='mobile' className='form-control input-field fs-6' placeholder='+91' />
              <label className=' fs-4 mt-0' >Address</label>
              <input type='text' onChange={onChange} value={userCredentials.address} name='address' className='form-control input-field fs-6' placeholder='Area, Nearby Location' />
              <label className=' fs-4 mt-0' >City</label>
              <input type='text' onChange={onChange} value={userCredentials.city} name='city' className='form-control input-field fs-6' placeholder='Enter your city name' />
              <label className=' fs-4 mt-0' >State</label>
              <input type='text' onChange={onChange} value={userCredentials.state} name='state' className='form-control input-field fs-6' placeholder='eg. West Bengal' />
              <label className=' fs-4 mt-0' >Postal Code</label>
              <input type='text' onChange={onChange} value={userCredentials.postalCode} name='postalCode' className='form-control input-field fs-6' placeholder='eg. 713302' />
              <button disabled={userCredentials.fullName === '' ||
                                userCredentials.email === '' ||
                                userCredentials.password === '' ||
                                userCredentials.mobile === '' ||
                                userCredentials.address === '' ||
                                userCredentials.city === '' ||
                                userCredentials.state === '' ||
                                userCredentials.postalCode === ''} onClick={handleRegister} className='btn btn-dark form-control mt-4 fs-4 bold  '>
                {processing === true ? <Spinner height='30' width='30' /> : 'Sign Up'}
              </button>
            </form>
          </div>
          <div className=" col-lg-3 col-sm-0"></div>
        </div>
      </div>
    </>
  )
}
