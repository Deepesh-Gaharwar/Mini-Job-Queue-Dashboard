import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';


function App() {
  return (
    <>
      <Dashboard />

      <ToastContainer />
    </>
  );
}

export default App;