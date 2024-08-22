import React, { useEffect, useState } from 'react';
import CreateCourse from './CreateCourse';  
import CourseDetails from './CourseDetails';


function Courses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        fetch('http://localhost:8080/api/v1/courses')
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    };

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/api/v1/courses/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                // Refresh the course list after removal
                fetchCourses();
            } else {
                console.error('Failed to remove course');
            }
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
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Course Title</th>
                        <th scope="col">Course Code</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>
                                <span onClick={() => handleCourseClick(course)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                    {course.courseTitle}
                                </span>
                            </td>
                            <td>{course.courseCode}</td>
                            <td><button onClick={() => handleRemove(course.id)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
