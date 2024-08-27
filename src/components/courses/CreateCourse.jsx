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
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        })
        .then(data => {
            setError('');
            setSuccess('Course created');
            setTimeout(() => setSuccess(''), 4000);
            setCourseTitle('');
            setCourseCode('');
            setCourseDescription('');
        })
        .catch(error => {
            console.error(error);
            setError(error.message);
            setTimeout(() => setError(''), 5000);
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
