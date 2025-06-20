import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Navbar from './components/Navbar';

/**
 * Glavna komponenta aplikacije sa rutiranjem
 * @returns {JSX.Element} Router sa definisanim rutama i navigacijom
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Dashboard />
            </>
          }
        />
        <Route
          path="/browse"
          element={
            <>
              <Browse />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;