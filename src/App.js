import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import axios from 'axios';

import SigninPage from './pages/Signin';
import ProfilePage from './pages/Profile';
import ItemListPage from './pages/ItemList';
import AddItemPage from './pages/AddItem';
import './App.css';


const Loading = () => {
  const history = useHistory();
  useEffect(() => {
    axios.get("/api/refresh")
      .then(() => history.push("/app"))
      .catch(() => history.push("/signin"))
  });
  return <p className="loading">Loading...</p>
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/app/profile"> <ProfilePage/> </Route>
        <Route path="/app/add"> <AddItemPage/> </Route>
        <Route path="/app"> <ItemListPage/> </Route>
        <Route path="/signin"> <SigninPage/> </Route>
        <Route path="/"> <Loading/> </Route>
      </Switch>
    </Router>
  );
}

export default App;
