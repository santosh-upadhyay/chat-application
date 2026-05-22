import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
// import Register from "./pages/register";
import { Toaster } from "react-hot-toast";
import ProjectedRoute from "./components/protectedRoute";
import Signup from "./pages/signup";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectedRoute><Home /></ProjectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
