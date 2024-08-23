import React, { useEffect, useState } from 'react';

import DeliveryDetails from "./DeliveryDetails";
import CreateDelivery from './CreateDelivery';

function Delivery() {
    const [delivery, setDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [year, setYear] = useState('2022'); // Default year
    const [semester, setSemester] = useState('1'); // Default semester

    useEffect(() => {
        fetchDelivery();
    }, [year, semester]);

    const fetchDelivery = () => {
        fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}`)
            .then(response => response.json())
            .then(data => setDelivery(data))
            .catch(error => console.error('Error fetching courses:', error));
    };

    const handleDeliveryClick = (delivery) => {
        setSelectedDelivery(delivery);
    };

    const closeDeliveryDetails = () => {
        setSelectedDelivery(null);
    };

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchDelivery();
            } else {
                console.error('Failed to remove course');
            }
        })
        .catch(error => console.error('Error removing course:', error));
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    return (
        <div>
            <h3>Course Instances</h3>
            <div>
                <label style={{ marginRight: '5px' }}>Year:</label>
                <input
                    type="number"
                    value={year}
                    onChange={handleYearChange}
                    placeholder="Year"
                    style={{ marginRight: '10px' }}
                />
                <label style={{ marginRight: '5px' }}>Semester:</label>
                <select value={semester} onChange={handleSemesterChange}>
                    {[...Array(8).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Course Title</th>
                        <th scope="col">Year-Sem</th>
                        <th scope="col">Code</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {delivery.length > 0 ? (
                        delivery.map(delivery => (
                            <tr key={delivery.id}>
                                <td>
                                    <span onClick={() => handleDeliveryClick(delivery)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                        {delivery.course.courseTitle}
                                    </span>
                                </td>
                                <td>{delivery.year}-{delivery.semester}</td>
                                <td>{delivery.course.courseCode}</td>
                                <td><button onClick={() => handleRemove(delivery.id)}>Remove</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>Filter Courses by Year and Semester</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedDelivery && (
                <DeliveryDetails
                    delivery={selectedDelivery} 
                    onClose={closeDeliveryDetails} 
                />
            )}
        </div>
    );
}

export default Delivery;
