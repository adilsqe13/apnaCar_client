import React, { useState } from 'react';
import toastContext from '../context/toastContext';

export default function ToastState(props) {
  const [toastDetails, setToastDetails] = useState(null);
  const showToast = (message, type) => {
    setToastDetails({
      msg: message,
      type: type
    })
  }
  return (
    <>
      <toastContext.Provider value={{toastDetails, showToast}}>
        {props.children}
      </toastContext.Provider>
    </>
  )
}
