import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import axios from 'axios';

import Signin from './pages/Signin';
import './App.css';


const Loading = () => {
  const history = useHistory();
  useEffect(() => {
    axios.get("/api/refresh")
      .then(() => history.push("/main"))
      .catch(() => history.push("/signin"))
  });
  return <p className="loading">Loading...</p>
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/main">
          <div><p>main</p></div>
        </Route>
        <Route path="/signin">
          <Signin/>
        </Route>
        <Route path="/">
          <Loading/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
