import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CreateUser.css'; // Import custom styles for CreateUser page

export default function CreateUser() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        firstname: '',
        lastname: '',
        age: '',
        email: '',
        password: '',
        job_title: '',
        access_level: '',
        birth_date: ''
    });
    const [accessLevels, setAccessLevels] = useState([]);
    const [loggedInUserAccessLevel, setLoggedInUserAccessLevel] = useState('');

    useEffect(() => {
        fetchAccessLevels();
        // Fetch logged-in user's access level
        // Here you should have the logic to fetch the access level of the logged-in user
        // For demonstration, let's assume it's passed as a prop
        setLoggedInUserAccessLevel('Super User'); // Assuming 'Super User' for demonstration
    }, []);

    const fetchAccessLevels = () => {
        axios.get('http://localhost/rosales_freshten/api/access_levels/')
            .then(response => {
                setAccessLevels(response.data);
            })
            .catch(error => {
                console.error('Error fetching access levels: ', error);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevState => ({
            ...prevState,
            [name]: name === 'access_level' ? parseInt(value) : value
        }));
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost/rosales_freshten/api/user/save', inputs)
            .then(response => {
                console.log(response.data);
                navigate('/list');
            })
            .catch(error => {
                console.error('Error adding user: ', error);
            });
    };

    return (
        <div className="create-user-container">
            <h1>Create User</h1>
            <form onSubmit={handleSubmit} className="create-user-form">
                <label>
                    Firstname:
                    <input type="text" name="firstname" value={inputs.firstname} onChange={handleChange} required />
                </label>
                <label>
                    Lastname:
                    <input type="text" name="lastname" value={inputs.lastname} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={inputs.email} onChange={handleChange} required />
                </label>
                <label>
                    Age:
                    <input type="number" name="age" value={inputs.age} onChange={handleChange} required />
                </label>
                <label>
                    Job Title:
                    <input type="text" name="job_title" value={inputs.job_title} onChange={handleChange} required />
                </label>
                <label>
                    Access Level:
                    <select name="access_level" value={inputs.access_level} onChange={handleChange} required>
                        <option value="">Select Access Level</option>
                        {accessLevels.map(level => (
                            <option key={level.access_level_id} value={level.access_level_id}>
                                {level.description}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={inputs.password} onChange={handleChange} required />
                </label>
                <label>
                    Birth Date:
                    <input type="date" name="birth_date" value={inputs.birth_date} onChange={handleChange} required />
                </label>
                {loggedInUserAccessLevel === 'Super User' && (
                    <button type="submit" className="create-user-button">Create User</button>
                )}
            </form>
        </div>
    );
}
