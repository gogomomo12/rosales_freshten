import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditUser.css"; // Import custom styles for EditUser page

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [inputs, setInputs] = useState({
        firstname: '',
        lastname: '',
        age: '',
        birth_date: '',
        email: '',
        password: '',
        job_title: '',
        access_level_id: ''
    });

    useEffect(() => {
        getUser();
    }, []);

    function getUser() {
        axios.get(`http://localhost/rosales_freshten/api/user/${id}`).then(function(response) {
            console.log(response.data);
            setInputs(response.data);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://localhost/rosales_freshten/api/user/${id}/edit`, inputs).then(function(response){
            console.log(response.data);
            navigate('/list');
        });
    }

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <table className="edit-user-table">
                    <tbody>
                        <tr>
                            <th>
                                <label htmlFor="firstname">First Name: </label>
                            </th>
                            <td>
                                <input value={inputs.firstname} type="text" id="firstname" name="firstname" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="lastname">Last Name: </label>
                            </th>
                            <td> 
                                <input value={inputs.lastname} type="text" id="lastname" name="lastname" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="age">Age: </label>
                            </th>
                            <td>
                                <input value={inputs.age} type="number" id="age" name="age" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="birth_date">Birth Date: </label>
                            </th>
                            <td>
                                <input value={inputs.birth_date} type="date" id="birth_date" name="birth_date" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="email">Email: </label>
                            </th>
                            <td>
                                <input value={inputs.email} type="email" id="email" name="email" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="password">Password: </label>
                            </th>
                            <td>
                                <input value={inputs.password} type="password" id="password" name="password" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="job_title">Job Title: </label>
                            </th>
                            <td>
                                <input value={inputs.job_title} type="text" id="job_title" name="job_title" onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="access_level_id">Access Level ID: </label>
                            </th>
                            <td>
                                <select id="access_level_id" name="access_level_id" value={inputs.access_level_id} onChange={handleChange}>
                                    <option value="1">Super User</option>
                                    <option value="2">Normal User</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="right">
                                <button type="submit" className="save-button">Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
