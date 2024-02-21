import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toastContext from '../CONTEXT/context/toastContext';
import Spinner from '../components/Spinner';

export default function Homepage() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const myToastcontext = useContext(toastContext);
  const { showToast } = myToastcontext;
  const token = localStorage.getItem('userToken');
  const agencyToken = localStorage.getItem('sellerToken');
  const [cars, setCars] = useState(null);
  const [daysSelect, setDaysSelect] = useState('');
  const [dateSelect, setDateSelect] = useState('');

  const getAllCars = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/get-all-cars`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
      });
      const json = await response.json();
      setCars(json.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  const handleRent = async (carId) => {
    try {
      if (token) {
        const response = await fetch(`${apiUrl}/api/user/car-rent`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "auth-token": token
          },
          body: JSON.stringify({ carId: carId, days: daysSelect, starting_date: dateSelect })
        });
        const json = await response.json();
        if (json.success) {
          showToast('Booking Successfully', 'success');
          navigate('/booking-page');
        }
      } else if (agencyToken) {
        showToast('You are in Rental Agency account', 'warning');
      } else {
        navigate('/customer-login');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCars();
  }, []);

  return (
    <>
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="container py-5">
          <h1 className='mt-3'>Rental Cars <small className='h6 text-secondary'>&nbsp; &nbsp; {cars === null ? 0 : cars.length} - cars</small></h1>
          <div className="row justify-content-center mb-3 mt-4">

            <h5 className='text-danger text-align-center dfjcac'>{cars === null ? '' : cars.length === 0 ? 'No Cars' : ''}</h5>
            {cars === null ? <Spinner height='70' width='70' /> : cars.map((item, index) => {
              return (
                <div key={index} className="col-md-12 col-xl-12 p-0 mt-1">
                  <div className="card shadow-0 box-shadow-light rounded-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0 dfjcac">
                          <div className="bg-image hover-zoom ripple rounded ripple-surface dfjcac">
                            <img className="img-fluid rounded-3" src={item.image} alt='img'
                              height={168}
                              width={170} />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-6">
                          <h5><span className='bold'>Model:</span> &nbsp;{item.vehicle_model}</h5>
                          <div>
                            <h6><span className='bold'>Agency Name:</span> &nbsp;<span className='text-primary'> {item.agencyName}</span> </h6>
                            <h6><span className='bold'>Vehicle Number:</span> &nbsp;<span className='text-dark'> {item.vehicle_number}</span> </h6>
                            <h6><span className='bold'>Seating Capacity:</span> &nbsp;<span className='text-dark'> {item.seating_capacity}</span> </h6>
                          </div>
                          <div className='row'>
                            <div className="col">
                              <strong className='fs-4'>Rent: </strong><small className='fs-6'>Rs.</small><span className='text-success bold fs-5'>{item.rent}/day</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">

                          {token && <select onChange={(e) => setDaysSelect(e.target.value)} name='days-select' value={daysSelect} className="form-select mt-2" aria-label="Default select example">
                            <option selected>Days select</option>
                            <option name='1' value="1">1</option>
                            <option name='2' value="2">2</option>
                            <option name='3' value="3">3</option>
                            <option name='4' value="4">4</option>
                            <option name='5' value="5">5</option>
                            <option name='6' value="6">6</option>
                            <option name='7' value="7">7</option>
                            <option name='8' value="8">8</option>
                            <option name='9' value="9">9</option>
                            <option name='10' value="10">10</option>
                          </select>}
                          {token && <p>
                            <label className='fs-6 mt-2' for="date">Choose starting date:</label>
                            <input className='form-control' onChange={(e) => { setDateSelect(e.target.value) }} type="date" id="date" name="date" value={dateSelect} />
                          </p>}
                          <div className="d-flex flex-column">
                            <button onClick={() => { handleRent(item._id) }} className="btn btn-success btn-sm mt-2 bold fs-5 rounded" type="button">
                              Rent Car
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>
      </section>
    </>
  )
}
