import {BrowserRounter,Routes, Route} from 'react-router-dom'

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';


function App() {
  return (
    <div className="App">
      <BrowserRounter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='login' element={<Login/>}/>    
          <Route path='register' element={<Register/>}/>
        </Routes>
      </BrowserRounter>
    </div>
  );
}

export default App;
