import './App.css';
import Home from './pages/Home';
import ChooseName from './pages/ChooseName';
import Room from './pages/Room';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='create-game' element={<ChooseName />} />
          <Route path=':roomId' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
