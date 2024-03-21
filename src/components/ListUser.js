import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import './ListUser.css'; // Import custom styles for ListUser page

function ListUser() {
  const [users, setUsers] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [loggedInUserAccessLevel, setLoggedInUserAccessLevel] = useState('');
  const location = useLocation();

  useEffect(() => {
    getUsers();
    getAccessLevels();
    setLoggedInUserInfo();
  }, []);

  function getUsers() {
    axios.get('http://localhost/rosales_freshten/api/employees/').then(function(response) {
      setUsers(response.data);
    });
  }

  function getAccessLevels() {
    axios.get('http://localhost/rosales_freshten/api/access_levels/').then(function(response) {
      setAccessLevels(response.data);
    });
  }

  const setLoggedInUserInfo = () => {
    const params = new URLSearchParams(location.search);
    setLoggedInUserEmail(params.get('email'));
    setLoggedInUserAccessLevel(params.get('access_level'));
  }

  const deleteUser = (id) => {
    if (loggedInUserAccessLevel === 'Super User' && users.find(user => user.employee_id === id)?.access_level_id !== 1) {
      axios.delete(`http://localhost/rosales_freshten/api/user/${id}/delete`).then(function(response){
        getUsers();
      }).catch(error => {
        console.error('Error deleting user: ', error);
      });
    } else {
      alert('You are not authorized to delete this user.');
    }
  }

  const getAccessLevelDescription = (accessLevelId) => {
    const accessLevel = accessLevels.find(level => level.access_level_id === accessLevelId);
    return accessLevel ? accessLevel.description : 'Unknown';
  }

  const isNormalUser = loggedInUserAccessLevel === 'Normal User';

  const actionsAvailable = users.some(user => {
    return loggedInUserAccessLevel === 'Super User' && user.access_level_id !== 1;
  });

  return (
    <div className="list-user-container">
      <h1>List Users</h1>
      <div className="user-info">
        <p>Email: {loggedInUserEmail}</p>
        <p>Access Level Description: {loggedInUserAccessLevel}</p>
        <div className="action-links">
          <Link to="/list/user/create" className="action-link">Create User</Link>
          {!isNormalUser && (
            <Link to="/list/user/create-access-level" className="action-link">Manage Access Levels</Link>
          )}
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Birth Date</th>
            <th>Email</th>
            <th>Password</th>
            <th>Date Created</th>
            <th>Job Title</th>
            <th>Access Level Description</th>
            <th>Date Modified</th>
            {actionsAvailable && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user, key) =>
            <tr key={key}>
              <td>{user.employee_id}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.age}</td>
              <td>{user.birth_date}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.date_created}</td>
              <td>{user.job_title}</td>
              <td>{getAccessLevelDescription(user.access_level_id)}</td>
              <td>{user.date_modified}</td>
              {actionsAvailable && (
                <td className="action-cell">
                  {loggedInUserAccessLevel === 'Super User' && user.access_level_id !== 1 ? (
                    <>
                      <Link to={`user/${user.employee_id}/edit`} className="action-link">Edit</Link>
  <button className="action-button" onClick={() => deleteUser(user.employee_id)}>Delete</button>
                    </>
                  ) : null}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListUser;
