import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
// import Register from "./pages/register";
import { Toaster } from "react-hot-toast";
import ProjectedRoute from "./components/protectedRoute";
import Signup from "./pages/signup";
import Loader from "./components/loader.js";
import { useSelector } from "react-redux";
import Profile from "./pages/profile/index.js";

function App() {
  const loader = useSelector((state) => state.loaderReducer);
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      {!loader && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectedRoute><Home /></ProjectedRoute>} />
          <Route path="/profile" element={<ProjectedRoute><Profile /></ProjectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
