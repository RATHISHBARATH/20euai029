import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import SocialComp from './SocialComp';

const App = () => {
  const API_URI = process.env.REACT_APP_API_PROXY || 'http://localhost:5000';

  const [trainData, setTrainData] = useState(null);
  const [numSeats, setNumSeats] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTrainData = async () => {
      const { data } = await axios.get(`${API_URI}/api/train`);
      setTrainData(data.train);
    };
    fetchTrainData();
  }, [API_URI]);

  const handleBookSeats = async () => {
    try {
      const { data } = await axios.post(`${API_URI}/api/train`, { numSeats });
      toast.success(`Booked Seat No: ${data.seats.join(', ')}`, {
        position: 'top-right',
        theme: 'colored',
      });
      setNumSeats('');

      const { data: newData } = await axios.get(`${API_URI}/api/train`);
      setTrainData(newData.train);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = parseInt(event.target.value) || '';
    if (inputValue < 1 || inputValue > 7) {
      setErrorMessage('Seats should be booked in a range of 1 - 7');
      setNumSeats('');
    } else {
      setNumSeats(inputValue); 
      setErrorMessage('');
    }
  };

  if (!trainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 flex flex-col md:flex-row items-center">
      <ToastContainer />
      <div className="max-w-md mx-auto md:max-w-2xl text-center">
        <h2 className="text-2xl text-[#ee5e5f] font-bold mb-14 pb-2 border-b border-[#eca74e4f] flex flex-col md:flex-row md:items-center md:justify-center">
          <span>Train Booking System by </span>
          <span className="md:ml-2">
            <a
              href=""
              target="_blank"
              className="text-[#eca74e] hover:text-[#149ddd] duration-500"
              rel="noreferrer"
            >
              Vaibhaw Mishra
            </a>
          </span>
        </h2>

        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src="https://cdn3.iconfinder.com/data/icons/placeholder/64/train-placeholder-pin-pointer-gps-map-location-512.png"
              alt="Train_image"
              className="w-48 h-48 md:h-full md:w-64 mx-auto"
            />
          </div>
          <div className="p-8 md:mt-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold cursor-default">
              Train Coach: A1
            </div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black hover:underline cursor-default">
              Train Number: 100001
            </p>
            <p className="mt-2 text-gray-500">
              Delhi <i className="fa-solid fa-arrow-right mx-2"></i> Banglore
            </p>
          </div>
        </div>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
          id="numSeats"
          type="number"
          placeholder="Enter number of seats you want to book"
          min="1"
          max="7"
          value={numSeats}
          onChange={handleInputChange}
        />
        <div className="flex justify-between items-center">
          <button
            className="bg-[#eca74e] hover:bg-[#ee5e5f] duration-200 text-white font-bold py-2 px-4 rounded mt-5 mr-4 mx-auto block"
            onClick={handleBookSeats}
          >
            Book Seats
          </button>
          <SocialComp />
        </div>
      </div>
      <div className=" mx-auto w-1/2 md:ml-5 mt-5 md:mt-0">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-5">
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-center items-center">
                <i className="fa-solid fa-couch text-green-500"></i>
                <span className="ml-2 text-sm">Available</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-couch text-red-500"></i>
                <span className="ml-2 text-sm">Booked</span>
              </div>
            </div>
          </div>
        </div>
        <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="grid grid-cols-7 gap-1 justify-center text-center">
              {trainData.coach.seats.map((seat) => (
                <div key={seat.number}>
                  {seat.isBooked ? (
                    <i className="fa-solid fa-couch text-red-500"></i>
                  ) : (
                    <i className="fa-solid fa-couch text-green-500"></i>
                  )}
                  <div className="text-sm">{seat.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
