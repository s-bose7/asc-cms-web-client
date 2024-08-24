import React, { useState } from 'react';


function CreateCourse() {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Simple input validation
        if (!courseTitle || !courseCode || !courseDescription) {
            setError('All fields are required.');
            setSuccess('');
            return;
        }

        const newCourse = {courseTitle, courseCode, courseDescription};

        fetch('http://localhost:8080/api/v1/courses', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse),
        })
        .then(response => {
            // Check if the request was successful
            console.log(response.status)
            if (response.ok) {
                return response.json();
            } else {
                // Handle specific status codes
                switch (response.status) {
                    case 409:
                        throw new Error('Course already exists');
                    default:
                        throw new Error('Internal Server Error');
                }
            }
        })
        .then(data => {
            setError('');
            setSuccess('Course created successfully!');
            // Refresh the course list after adding a new course
            // onCourseCreate(); 
            // Clear form fields
            setCourseTitle('');
            setCourseCode('');
            setCourseDescription('');
        })
        .catch(error => {
            console.error(error);
            setError(error.message);
            setSuccess('');
        });
    };

    return (
    <>
        <div>
            <h3>Create Course</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <div>
                        <input
                            type="text"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            placeholder="Course Title"
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            placeholder="Course Code"
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            placeholder="Course Description"
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Course</button>
                </div>
            </form>
        </div>
    </>
    );
}

export default CreateCourse;
