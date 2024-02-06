import React, { useState } from 'react';
import './style.css'; // Importăm fișierul CSS pentru stilizare

function App() {
  const [qrCodeText, setQrCodeText] = useState(''); // Starea pentru textul codului QR
  const [qrCodeImage, setQrCodeImage] = useState(''); // Starea pentru imaginea codului QR

  // Funcție pentru crearea notificării
  const createNotification = (message = "Copied To Clipboard") => {
    const notif = document.createElement('div')
    notif.classList.add('toast')
    notif.innerText = message
    document.getElementById('toasts').appendChild(notif)

    setTimeout(()=>{
        notif.remove()
    },2500)
  }

  // Funcție pentru solicitarea de scanare a codului QR
  const fetchRequest = (formData, file) => {
    setQrCodeText("Scanning QR Code...");
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(result => {
      result = result[0].symbol[0].data;
      setQrCodeText(result ? "Upload QR Code to Scan" : "Couldn't Scan QR Code");
      if(!result) return;
      setQrCodeText(result);
      setQrCodeImage(URL.createObjectURL(file));
      document.querySelector("img").src = URL.createObjectURL(file);
      document.querySelector('.wrapper').classList.add("active");
    })
    .catch(() => {
      setQrCodeText("Couldn't Scan QR Code");
    })
  }

  // Funcție pentru gestionarea schimbării fișierului
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file) {
      const formData = new FormData();
      formData.append("file", file);
      fetchRequest(formData, file);
    }
  };

  // Funcție pentru copierea textului
  const handleCopyText = () => {
    const text = qrCodeText;
    navigator.clipboard.writeText(text);
    createNotification();
  };

  // Funcție pentru închiderea componentei
  const handleClose = () => {
    document.querySelector('.wrapper').classList.remove("active");
    setTimeout(() => {
      window.location.reload();
    }, 550);
  };

  return (
    <div className="wrapper">
      <form id="form1">
        <input type="file" id="file" onChange={handleFileChange} hidden />
        <img src={qrCodeImage} alt="qr-code" />
        <div className="content">
          <i className="fas fa-cloud-upload"></i>
          <p id="ptext">{qrCodeText}</p>
        </div>
      </form>
      <div className="details">
        <textarea disabled id="textArea" value={qrCodeText}></textarea>
        <div className="buttons">
          <button className="close" onClick={handleClose}>Close</button>
          <button className="copy" onClick={handleCopyText}>Copy Text</button>
        </div>
      </div>
    </div>
  );
}

export default App;
