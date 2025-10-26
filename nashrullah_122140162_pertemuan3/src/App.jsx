import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home/Home";
import { Stats } from "./pages/Stats/Stats";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}

export default App;
