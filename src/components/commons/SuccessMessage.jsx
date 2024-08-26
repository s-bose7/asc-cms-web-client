import React from 'react';

const SuccessMessage = ({ message }) => (
    <div style={styles.successMsg}>
        {message}
    </div>
);

const styles = {
    successMsg: {
        position: 'absolute', 
        top: '60%',
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        color: 'green',
    },
};

export default SuccessMessage;
