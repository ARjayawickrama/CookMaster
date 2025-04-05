import React, { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
    });
    const [skillInput, setSkillInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }

        if (!isValid) {
            return; // Stop execution if validation fails
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('User registered successfully!');
                setFormData({ fullname: '', email: '', password: '', phone: '', skills: [] });
                window.location.href = '/'
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="Auth_container">
                <div className="Auth_innerContainer_reg">
                    <div className="Auth_content">
                        <div className="Auth_content_img_reg"></div>
                    </div>
                    <div className="Auth_content_reg new_content">
                        <div className="Auth_logo"></div>
                        <div className='login_content'>
                            <p className="Auth_heading">Create your account!</p>
                        </div>
                        <form onSubmit={handleSubmit} className="Auth_form">
                            <div className="Auth_formGroup">
                                <label className="Auth_label">Full Name</label>
                                <input
                                    className="Auth_input"
                                    type="text"
                                    name="fullname"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="Auth_formGroup">
                                <label className="Auth_label">Email Address</label>
                                <input
                                    className="Auth_input"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="Auth_formGroup">
                                <label className="Auth_label">Password</label>
                                <input
                                    className="Auth_input"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="Auth_formGroup">
                                <label className="Auth_label">Phone</label>
                                <input
                                    className="Auth_input"
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]{0,10}$/;
                                        if (re.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    title="Please enter exactly 10 digits."
                                    required
                                />
                            </div>
                            <div className="Auth_formGroup">
                                <label className="Auth_label">Skills</label>
                                <div className='skil_dis_con'>
                                    {formData.skills.map((skill, index) => (
                                        <p className='skil_name' key={index}>{skill}</p>
                                    ))}
                                </div>
                                <div className='skil_addbtn'>
                                    <input
                                        className="Auth_input"
                                        type="text"
                                        placeholder="Add Skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                    />
                                    <IoMdAdd onClick={handleAddSkill} className="add_s_btn" />

                                </div>
                            </div>

                            <button type="submit" className="Auth_button">Register</button>
                            <p className="Auth_signupPrompt">
                                You have an account? <span onClick={() => (window.location.href = '/')} className="Auth_signupLink">Sign now</span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;
