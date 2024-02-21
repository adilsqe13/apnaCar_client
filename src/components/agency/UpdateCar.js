import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toastContext from '../../CONTEXT/context/toastContext';
import Spinner from '../Spinner';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const context = useContext(toastContext);
    const { showToast } = context;
    const agencyToken = localStorage.getItem('sellerToken');
    const [productDetails, setProductDetails] = useState({
        vehicle_model: '',
        vehicle_number: '',
        seating_capacity: '',
        rent: '',
    });
    const [image, setImage] = useState('');
    const [uploadPercent, setUploadPercent] = useState('');

    const getCarDetails = async (carId) => {
        try {
            const response = await fetch(`${apiUrl}/api/agency/car-details/${carId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": agencyToken
                },

            });
            const json = await response.json();
            setProductDetails({
                vehicle_model: await json[0].vehicle_model,
                vehicle_number: await json[0].vehicle_number,
                seating_capacity: await json[0].seating_capacity,
                rent: await json[0].rent,
            });
        } catch (error) {
            console.log(error);
        }

    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (image !== '') {
            console.log('hi');
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'my-preset');
            formData.append('cloud_name', process.env.REACT_APP_CLOUD_NAME);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/digcjdyd3/image/upload`,
                    formData,
                    {
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadPercent(percentCompleted + '%')
                        },
                    }
                );

                const public_id = await response.data.public_id;
                const result = await axios.put(
                    `${apiUrl}/api/agency/update-car`,
                    {
                        ...productDetails,
                        imageUrl: response.data.secure_url,
                        public_id: public_id,
                        carId: localStorage.getItem('carId'),
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': agencyToken,
                        },
                    }
                );

                if (response.data.success) {
                    navigate('/get-my-cars');
                }
            } catch (error) {
                console.error('Error uploading product:', error);
                window.scrollTo(0, 0);
                showToast('Error updating details', 'error');
                navigate('/get-my-cars');
            }
        } else {
            try {
                const response = await axios.put(
                    `${apiUrl}/api/agency/update-car`,
                    {
                        ...productDetails,
                        carId: localStorage.getItem('carId'),
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': agencyToken,
                        },
                    }
                );

                if (response.data.success) {
                    navigate('/get-my-cars');
                }

            } catch (error) {
                console.error('Error updating car details:', error);
                window.scrollTo(0, 0);
                showToast('Error Updating Details', 'error');
                navigate('/get-my-cars');
            }

        }
    };

    const onInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onChange = (event) => {
        setProductDetails({ ...productDetails, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        getCarDetails(localStorage.getItem('carId'));
    }, []);

    return (
        <>
            <div className="container margin-top-md mt-5">
                <div className="row">
                    <div className=" col-lg-3 col-sm-0"></div>
                    <div className=" col-lg-6 col-sm-12 mini-container">
                        <h1>Update Car Details</h1>
                        <form className='form-group'>
                            <label className=' fs-4 mt-1' >Vehicle Model</label>
                            <input type='text' onChange={onChange} name='vehicle_model' value={productDetails.vehicle_model} className='form-control input-field fs-4' />
                            <label className=' fs-4 mt-1 ' >Vehicle Number</label>
                            <input type='text' onChange={onChange} name='vehicle_number' value={productDetails.vehicle_number} className='form-control input-field fs-4' />
                            <label className=' fs-4 mt-1 ' >Seating Capacity</label>
                            <input type='number' onChange={onChange} name='seating_capacity' value={productDetails.seating_capacity} className='form-control input-field fs-4' />
                            <label className=' fs-4 mt-1' >Rent per day</label>
                            <input type='number' onChange={onChange} name='rent' value={productDetails.rent} className='form-control input-field fs-4' />
                            <label className='fs-6 mt-4 text-primary bold' >Upload Car Image  &nbsp; <span className='text-danger'>{uploadPercent}</span></label> &nbsp;
                            <input type="file" onChange={onInputChange} />
                            <button disabled={productDetails.vehicle_model === '' ||
                                productDetails.vehicle_number === '' ||
                                productDetails.seating_capacity === '' ||
                                productDetails.rent === ''
                            } onClick={handleUpdate} className='btn btn-warning form-control mt-4 fs-4 bold '>
                                {uploadPercent !== '' ? <Spinner height='30' width='30' /> : 'Submit'}
                            </button>
                        </form>
                    </div>
                    <div className=" col-lg-3 col-sm-0"></div>
                </div>
            </div>
        </>
    )
}
