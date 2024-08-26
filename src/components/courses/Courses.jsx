import React, { useEffect, useState } from 'react';
import CreateCourse from './CreateCourse';  
import CourseDetails from './CourseDetails';
import ErrorMessage from '../commons/ErrorMessage';
import LoadingMessage from '../commons/LoadingMessage';
import SuccessMessage from '../commons/SuccessMessage';


function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        fetch('http://localhost:8080/api/v1/courses')
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.data)) {
                    setCourses(data.data);
                } else {
                    console.error('No courses found');
                    setCourses([]);  
                }
            })
            .catch(error => console.error('Error fetching courses:', error));
    };

    const handleRemove = (id) => {
        setIsLoading(true);
        fetch(`http://localhost:8080/api/v1/courses/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            setTimeout(() => { 
                if (response.ok) {
                    setSuccess('Course Removed');
                    fetchCourses(); 
                    setTimeout(() => setSuccess(''), 1000);
                } else {
                    setError('Failed');
                    console.error('Failed to remove course');
                    setTimeout(() => setError(''), 1000);
                }
                setIsLoading(false);
            }, 1500);
        })
        .catch(error => console.error('Error removing course:', error));
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
    };

    const closeCourseDetails = () => {
        setSelectedCourse(null);
    };

    return (
        <div>
            <h3>Courses Available</h3>
            <div style={ {position: 'relative'} }>
                {isLoading && <LoadingMessage message="Removing..." />}
                {success && !isLoading && <SuccessMessage message={success} />}
                {error && !isLoading && <ErrorMessage message={error} />}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Course Title</th>
                            <th scope="col">Course Code</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <span onClick={() => handleCourseClick(course)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                            {course.courseTitle}
                                        </span>
                                    </td>
                                    <td>{course.courseCode}</td>
                                    <td><button onClick={() => handleRemove(course.id)}>Remove</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No courses available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedCourse && (
                <CourseDetails
                    course={selectedCourse} 
                    onClose={closeCourseDetails} 
                />
            )}
        </div>
    );
}

export default Courses;
