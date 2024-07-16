import React, { useState } from 'react';
import './NewService.css'

function AddNewService() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const priceFloat = parseFloat(price);
  
    const serviceData = {
      name: name,
      description: description, 
      price: priceFloat,
    };
  
    fetch('/services_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Service added:', data);
      alert('Service added successfully')
    })
    .catch(error => {
      console.error('Error adding service:', error);
    });
  };

  

  return (
    <div className='newservice'>
        <div>
          <h1>Add new service</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
      
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
      
            <label htmlFor="price">Price:</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
      
            <button type="submit">Add Service</button>
          </form>
        </div>
    </div>
  );
}

export default AddNewService;