import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';


const Loading = () => {
  useEffect(() => {
    // TODO: ping server to see if signed in
  });
  return <p className="loading">Loading...</p>
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <div><p>about</p></div>
        </Route>
        <Route path="/users">
          <div><p>users</p></div>
        </Route>
        <Route path="/">
          <Loading/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
