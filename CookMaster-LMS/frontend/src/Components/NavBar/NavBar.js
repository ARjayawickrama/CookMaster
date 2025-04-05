import React, { useEffect, useState } from 'react';
import { FaUserGraduate } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import './NavBar.css';
import './UserCard.css'; // Import CSS for the card

function NavBar() {
    const [allRead, setAllRead] = useState(true);
    const [showCard, setShowCard] = useState(false); 
    const [userData, setUserData] = useState(null); 
    const userId = localStorage.getItem('userID');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadNotifications = response.data.some(notification => !notification.read);
                setAllRead(!unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchNotifications();
            fetchUserData(); // Fetch user data on component mount
        }
    }, [userId]);

    const currentPath = window.location.pathname;

    return (
        <div className="navbar">
            <div className='nav_item_set'>
                <div className='side_logoo'></div>
                <div className='nav_bar_item'>
                    {allRead ? (
                        <MdNotifications
                            className={`nav_item_icon ${currentPath === '/notifications' ? 'nav_item_icon_noty' : ''}`}
                            onClick={() => (window.location.href = '/notifications')} />
                    ) : (
                        <MdNotificationsActive className='nav_item_icon_noty' onClick={() => (window.location.href = '/notifications')} />
                    )}
                    <IoLogOut
                        className='nav_item_icon'
                        onClick={() => {
                            localStorage.removeItem('userID');
                            localStorage.removeItem('userType');
                            window.location.href = '/';
                        }}
                    />
                    <FaUserGraduate
                        className='nav_item_icon'
                        style={{ display: localStorage.getItem('userType') === 'googale' ? 'none' : 'block' }}
                        onClick={() => setShowCard(!showCard)} 
                    />
                </div>
            </div>
            {showCard && userData && (
                <div className="user-card">
                    <p><strong>Full Name:</strong> {userData.fullname}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                    <p><strong>Skills:</strong> {userData.skills.join(', ')}</p>
                    <button onClick={() => (window.location.href = `/updateUserProfile/${userId}`)}>Update Profile</button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete your profile?')) {
                                axios.delete(`http://localhost:8080/user/${userId}`)
                                    .then(() => {
                                        alert('Profile deleted successfully!');
                                        localStorage.removeItem('userID');
                                        window.location.href = '/';
                                    })
                                    .catch(error => console.error('Error deleting profile:', error));
                            }
                        }}
                    >
                        Delete Profile
                    </button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
