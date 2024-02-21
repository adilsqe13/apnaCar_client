import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import toastContext from '../../CONTEXT/context/toastContext';
import Spinner from '../Spinner';

export default function Login() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const context = useContext(toastContext);
    const { showToast } = context;
    const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setProcessing(true);
        e.preventDefault();

        const response = await fetch(`${apiUrl}/api/auth/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: userCredentials.email, password: userCredentials.password })
        });

        try {
            const json = await response.json();
            setProcessing(false);
            if (json.success) {
                localStorage.setItem('userToken', json.authToken);
                localStorage.setItem('userFullName', json.userFullName);
                navigate('/');
                window.scrollTo(0, 0);
            } else {
                navigate('/customer-login');
                showToast('Invalid Credentials', 'error');
            }
        } catch (error) {
            console.log(error);
        }

    }
    const onChange = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
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
                        <h1>Customer Login</h1>
                        <form className='form-group mt-4'>
                            <label className=' fs-4 mt-1' >Email</label>
                            <input type='email' onChange={onChange} value={userCredentials.email} name='email' autoComplete="username" className='form-control input-field fs-5' />
                            <label className=' fs-4 mt-1 ' >Password</label>
                            <input type='password' onChange={onChange} value={userCredentials.password} name='password' autoComplete="password" className='form-control input-field fs-5' />
                            <p className='mt-3'>Don't have an account<Link to='/customer-signup'><small className='text-danger bold'> Sign Up</small></Link></p>
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
