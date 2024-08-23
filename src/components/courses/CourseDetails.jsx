import React from 'react';

function CourseDetails({ course, onClose }) {
    if (!course) return null;

    return (
        <div style={cardStyles}>
            <button onClick={onClose} style={closeButtonStyles}>X</button>
            <h2>{course.courseTitle}</h2>
            <p><strong>Course Code:</strong> {course.courseCode}</p>
            <p><strong>Description:</strong> {course.courseDescription}</p>
        </div>
    );
}

const cardStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fadabc',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    maxWidth: '600px',
    width: '100%',
    borderRadius: '8px',
};

const closeButtonStyles = {
    position: 'absolute',
    top: '10px',
    right: '5px',
    cursor: 'pointer',
};

export default CourseDetails;
