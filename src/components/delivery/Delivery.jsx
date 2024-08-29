import React, { useEffect, useState } from 'react';

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import DeliveryDetails from "./DeliveryDetails";
import CreateDelivery from './CreateDelivery';
import ErrorMessage from '../commons/ErrorMessage';
import LoadingMessage from '../commons/LoadingMessage';
import SuccessMessage from '../commons/SuccessMessage';


function Delivery() {
    const [delivery, setDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [year, setYear] = useState('2022'); // Default year
    const [semester, setSemester] = useState('1'); // Default semester
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchDelivery();
    }, [year, semester]);

    const fetchDelivery = () => {
        fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}`)
            .then(response => response.json())
            .then(data => setDelivery(data.data))
            .catch(error => console.error('Error fetching courses:', error));
    };

    const handleDeliveryClick = (delivery) => {
        setSelectedDelivery(delivery);
    };

    const closeDeliveryDetails = () => {
        setSelectedDelivery(null);
    };

    const handleRemove = (id) => {
        setIsLoading(true);
        fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            setTimeout(() => { 
                if (response.ok) {
                    setSuccess('Session Removed');
                    fetchDelivery(); 
                    setTimeout(() => setSuccess(''), 1500); 
                } else {
                    setError('Failed');
                    console.error('Failed to remove course session');
                    setTimeout(() => setError(''), 1500);
                }
                setIsLoading(false);
            }, 1500);
        })
        .catch(error => {
            console.error('Error removing course:', error);
            setIsLoading(false);
        });
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    return (
        <div>
            <div style={{marginBottom:20}}>
                <label style={{ marginRight: '5px' }}>Year:</label>
                <input
                    type="number"
                    value={year}
                    onChange={handleYearChange}
                    placeholder="Year"
                    style={{ marginRight: '10px', width: '150px'}}
                />
                <label style={{ marginRight: '5px' }}>Semester:</label>
                <select style={{ height: '28px', width: '50px' }} value={semester} onChange={handleSemesterChange}>
                    {[...Array(8).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>
            <div style={styles.container}>
                {isLoading && <LoadingMessage message="Deleting..." />}
                {success && !isLoading && <SuccessMessage message={success} />}
                {error && !isLoading && <ErrorMessage message={error} />}
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
                                    <td>
                                        <Button 
                                            onClick={() => handleRemove(delivery.id)} 
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DeleteIcon />}>Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>Filter Courses by Year and Semester</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedDelivery && (
                <DeliveryDetails
                    delivery={selectedDelivery} 
                    onClose={closeDeliveryDetails} 
                />
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
    },
};

export default Delivery;
