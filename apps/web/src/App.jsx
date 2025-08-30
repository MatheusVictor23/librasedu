// src/App.jsx
import HomePageWrapper from './pages/HomePage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import RegisterPageWrapper from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePageWrapper />}/>
      <Route path='/register' element={<RegisterPageWrapper/>}/>
      <Route path="/login" element={<LoginPage/>}/>
    </Routes>
  </BrowserRouter>
);
}

export default App;