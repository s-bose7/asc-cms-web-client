import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "./styles/App.css";

import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Courses from "./components/courses/Courses";
import CreateCourse from "./components/courses/CreateCourse";
import Delivery from './components/delivery/Delivery';
import CreateDelivery from './components/delivery/CreateDelivery';

function App() {
    return (
        <div className="app-container">
            <div className="Navigation-bar">
                <Navbar/>
            </div>
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
                    <Route path="/course-instances" element={
                        <>
                            <div className="form-container">
                                <div className="create-course-gp"><CreateDelivery /></div>
                            </div>
                            <div className="table-container">
                                <div className="course-table-gp"><Delivery /></div>
                            </div>
                        </>
                    } />
                </Routes>
            </div>
            <Footer/>
        </div>
    );
}

export default App;
