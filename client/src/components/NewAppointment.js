import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import './NewAppointment.css'; 

const NewAppointment = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    reason: "",
    appointment_date: "",
    doctor_id: "",
    status: "Scheduled",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setAccessToken(storedToken);

    // Fetch doctors
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/doctors', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!accessToken) {
      console.error('Access token not found. Please log in first.');
      return;
    }
  
    // Format the date before sending
    const formattedData = {
      ...appointmentData,
      appointment_date: formatDate(appointmentData.appointment_date),
    };
  
    try {
      const response = await fetch('/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Appointment created:', data);
      navigate('/profile');
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleChange = (event) => {
    setAppointmentData({
      ...appointmentData,
      [event.target.name]: event.target.value,
    });
  };

  // Function to format date to '%Y-%m-%d %H:%M:%S'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Function to format date for input field
  const formatDateForInput = (dateString) => {
    return dateString.slice(0, 16); // Cut off seconds for input compatibility
  };

  return (
    <>
    <Navbar />
    <div className='newappointment'>
      <h2>Create New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reason">Reason for Appointment:</label>
          <br/><br/>
          <input
            type="text"
            id="reason"
            name="reason"
            value={appointmentData.reason}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="appointment_date">Appointment Date:</label>
          <br/><br/>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            value={formatDateForInput(appointmentData.appointment_date)}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="doctor_id">Doctor:</label>
          <br/><br/>
          <select
            id="doctor_id"
            name="doctor_id"
            value={appointmentData.doctor_id}
            onChange={handleChange}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {`${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`}
              </option>
            ))}
          </select>
        </div>
        <br/><br/>
        <button type="submit">Create Appointment</button>
      </form>
    </div>
    </>
  );
};

export default NewAppointment;