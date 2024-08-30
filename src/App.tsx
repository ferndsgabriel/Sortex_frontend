import "./App.css";
import RoutesApp from "./routes";
import { BrowserRouter } from "react-router-dom"; // Usando BrowserRouter
import AuthProvider from "./contexts/AuthContexts";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
