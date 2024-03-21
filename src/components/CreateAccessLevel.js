import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CreateAccessLevel.css'; // Import custom styles for CreateAccessLevel page

export default function CreateAccessLevel() {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');

    const handleChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newAccessLevel = { description };

        axios.post('http://localhost/rosales_freshten/api/access_levels/save', newAccessLevel)
            .then(response => {
                console.log(response.data);
                navigate('/list'); // Redirect to home page or any other desired page
            })
            .catch(error => {
                console.error('Error adding access level: ', error);
            });
    };

    return (
        <div className="create-access-level-container">
            <h1>Add Access Level</h1>
            <form onSubmit={handleSubmit} className="access-level-form">
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    required
                    className="access-level-input"
                />
                <button type="submit" className="add-access-level-button">Add Access Level</button>
            </form>
        </div>
    );
}
