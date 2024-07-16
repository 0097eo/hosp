import React, { useEffect, useState } from "react";
import './Services.css';

function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDropdownService, setSelectedDropdownService] = useState("");

  useEffect(() => {
    fetch("/services_data")
      .then((r) => r.json())
      .then(setServices)
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  function handleDelete(id) {
    fetch(`/service_data/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          setServices(services.filter((service) => service.id !== id));
          if (selectedService && selectedService.id === id) {
            setSelectedService(null);
            setSelectedDropdownService("");
          }
        } else {
          throw new Error("Failed to delete service");
        }
      })
      .catch((error) => console.error("Error deleting service:", error));
  }


  async function handleUpdate(id) {
    const updatedFields = {};
    updatedFields.name = prompt("Enter updated name:", selectedService.name);
    updatedFields.description = prompt("Enter updated description:", selectedService.description);
    updatedFields.price = prompt("Enter updated price:", selectedService.price);
  
    if (!updatedFields.name && !updatedFields.description && !updatedFields.price) {
      return;
    }
  
    try {
      const response = await fetch(`/service_data/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
  
      if (response.ok) {
        alert("Service updated successfully");
        fetch(`/service_data/${id}`)
          .then((r) => r.json())
          .then((updatedService) => {
            setSelectedService(updatedService);
            fetch("/services_data")
              .then((r) => r.json())
              .then(setServices);
          });
      } else {
        throw new Error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  }

  

  function handleDropdownChange(event) {
    const selectedId = event.target.value;
    const selected = services.find(service => service.id === parseInt(selectedId));
    setSelectedDropdownService(selectedId);
    setSelectedService(selected);
  }

  return (
    <div className="services-container">
      <div className="dropdown">
        <h2>Services List</h2>
        <select value={selectedDropdownService} onChange={handleDropdownChange}>
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      {selectedService && (
        <div className="details">
          <h3>{selectedService.name}</h3>
          <p><strong>Description:</strong> {selectedService.description}</p>
          <p><strong>Price:</strong> Ksh {selectedService.price}</p>
          <div className="button-group">
            <button onClick={() => handleUpdate(selectedService.id)}>Update</button>
            <button onClick={() => handleDelete(selectedService.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;