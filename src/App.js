import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './App.css';

import { useCallback, useRef, useState } from 'react';
import { set } from './slices/userSlice';
import Login from './components/login/Login';
import Register from './components/register/Register';
import MainPage from './components/pages/mainPage/MainPage';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp, { client } from 'stompjs';
import SockJsClient from 'react-stomp';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from './slices/userSlice';

const App = () => {

  const dispatch = useDispatch();
  // const activeChat = useSelector(state => state.activeChat);
  // const user = useSelector(state => state.user);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  
  const isExpired = () => {
    if(window.localStorage.getItem('jwt-token') === null) {
      return false;
    }
    return parseJwt(window.localStorage.getItem('jwt-token')).exp * 1000 > Date.now();
  }

  useEffect(() => {
    if(!isExpired()) {
      return;
    }
    fetch(`http://localhost:8080/user/${window.localStorage.getItem('id')}`, {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
        },
        method: "GET"
    })
    .then(res => res.json())
    .then(data =>  dispatch(set(data)));
  }, [dispatch]);


  const AuthWrapper = () => {
    return isExpired()
      ? <Outlet /> 
      : window.localStorage.getItem('jwt-token') !== null 
      ? <Navigate to="/login" replace/> 
      : <Navigate to="/register" replace/>;
      
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<AuthWrapper/>}>
          <Route path="/" element={ <MainPage/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
