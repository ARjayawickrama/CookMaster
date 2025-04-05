import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar';
import './notification.css'
import { RiDeleteBin6Fill } from "react-icons/ri";
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        console.log('API Response:', response.data); // Debugging log
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    } else {
      console.error('User ID is not available');
    }
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div>
      <div className='continer'>
        <div><SideBar /></div>
        <div className='continSection'>
          <div className='post_card_continer'>
            {notifications.length === 0 ? (
              <div className='not_found_box'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No notifications found.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className='post_card'>
                  <div className='continer_set'>
                    <p className='noty_topic'>{notification.message}</p>
                    <p className='noty_time'>{notification.createdAt}</p>
                  </div>
                  <div className='noty_action_btn_con'>
                    <button
                      className='mark_redbtn'
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{ display: notification.read ? 'none' : 'inline-block' }}
                    >
                      Mark as Read
                    </button>
                    <RiDeleteBin6Fill
                      onClick={() => handleDelete(notification.id)}
                      className='action_btn_icon' />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
