import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import "./assets/css/style.css";
import "./assets/css/globals.css";
import About from './components/about';
import Home from './components/home';
<<<<<<< HEAD
import Task from './components/task/taskList';
=======
import Project from './components/project/projectList';
>>>>>>> 9c503cce (updated env)

const App = () => {
  return (
    <Router>
      <div>
      <Header/>
        <Sidebar/>
        <main id="main" className="main">
        <Routes>
        <Route path="/project" element={<Project />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/task" element={<Task />} />
        </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;