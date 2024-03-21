import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreateUser from './components/CreateUser';
import CreateAccessLevel from './components/CreateAccessLevel';
import EditUser from './components/EditUser';
import ListUser from './components/ListUser';
import Login from './components/Login'; // Import the Login component

function App() {
  return (
    <div className="App">
      <h5>React CRUD operations using PHP API and MySQL</h5>

      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} /> {/* Set Login as the index route */}
          <Route path="list" element={<ListUser />} />
          <Route path="list/user/create" element={<CreateUser />} />
          <Route path="list/user/create-access-level" element={<CreateAccessLevel />} />
          <Route path="list/user/:id/edit" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
