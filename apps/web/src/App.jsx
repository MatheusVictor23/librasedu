// src/App.jsx
import HomePageWrapper from './pages/HomePage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import RegisterPageWrapper from './pages/RegisterPage';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePageWrapper />}/>
      <Route path='/register' element={<RegisterPageWrapper/>}/>
    </Routes>
  </BrowserRouter>
);
}

export default App;