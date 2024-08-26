import React from 'react';

const ErrorMessage = ({ message }) => (
    <div style={styles.errorMsg}>
        {message}
    </div>
);

const styles = {
    errorMsg: {
        position: 'absolute', 
        top: '60%',
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        color: 'red',
    },
};

export default ErrorMessage;
