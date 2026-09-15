import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-red-400">
          Job Queue Dashboard
        </h1>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;