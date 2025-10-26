import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import FormsManagement from "./pages/FormsManagement";
import FormTypesManagement from "./pages/FormTypesManagement";
import Dashboard from "./pages/Dashboard";
// import DataVisualization from "./pages/DataVisualization";
import DataAnalyticsModule from "./pages/DataAnalyticsModule";


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/forms" element={<FormsManagement />} />
          <Route path="/form-types" element={<FormTypesManagement />} />
          <Route path="/data-visualization" element={<DataAnalyticsModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
