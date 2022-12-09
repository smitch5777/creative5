import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Layout from './pages/Layout';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="ForSale" element={<ForSale />} /> */}
          <Route path="Favorites" element={<Favorites />} />
          {/* <Route path="SellDuck" element={<SellDuck />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;