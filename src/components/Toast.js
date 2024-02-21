import React, { useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import toastContext from '../CONTEXT/context/toastContext';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
    const context = useContext(toastContext);
    const { toastDetails } = context;

    const notify = async () => {
        if (toastDetails) {
            await toast[`${toastDetails.type}`](`${toastDetails.msg}`);
        }
    }

    useEffect(() => {
        notify();
    }, [notify]);
    return (
        <>
            <ToastContainer />
        </>
    )
}
