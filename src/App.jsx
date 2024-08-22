import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "./styles/App.css";
import Navbar from "./components/Navbar";
import Courses from "./components/courses/Courses";
import CreateCourse from "./components/courses/CreateCourse";
import Delivery from './components/delivery/Delivery';


function App() {
    return (
    <Fragment>
        <div className="Navigation-bar">
            <Navbar/>
            <div className="main-content"> 
                <Routes>
                    <Route path="/courses" element={
                        <>
                            <div className="form-container">
                                <div className="create-course-gp"><CreateCourse /></div>
                            </div>
                            <div className="table-container">
                                <div className="course-table-gp"><Courses /></div>
                            </div>
                        </>
                    } />
                    <Route path="/course-instances" element={<Delivery />} />
                </Routes>
            </div>
        </div>
    </Fragment>
    );
}

export default App;