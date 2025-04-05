import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css'
import SideBar from '../../Components/SideBar/SideBar';
function AddLeariningPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');
    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/'); 
      return;
    }
    const isValid = tags.length >= 2; 
    if (!isValid) {
      alert("Please add at least two tags.");
      return;
    }
    const newPost = { title, description, contentURL, tags, postOwnerID, postOwnerName }; 
    console.log('Data being sent:', newPost); 
    try {
      await axios.post('http://localhost:8080/learningSystem', newPost);
      alert('Post added successfully!');
      setTitle('');
      setDescription('');
      setContentURL('');
      setTags([]);
      window.location.href = '/learningSystem/allLearningPost';
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    }
  };

  return (
    <div>
      <div className='continer'>
        <div>
          <SideBar />
        </div>
        <div className='continSection'>
          <div className="from_continer">
            <p className="Auth_heading">Add Learning Post</p>
            <form onSubmit={handleSubmit} className='from_data'>
              <div className="Auth_formGroup">
                <label className="Auth_label">Title</label>
                <input
                  className="Auth_input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="Auth_formGroup">
                <label className="Auth_label">Content URL</label>
                <input
                  className="Auth_input"
                  type="url"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Tags</label>
                <div className='skil_dis_con'>
                  {tags.map((tag, index) => (
                    <p className='skil_name' key={index} >
                      {tag}
                    </p>
                  ))}
                </div>
                <div className='skil_addbtn'>
                  <input
                    className="Auth_input"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <IoMdAdd onClick={handleAddTag} className="add_s_btn" />
                </div>

              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Description</label>
                <textarea
                  className="Auth_input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <button type="submit" className="Auth_button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLeariningPost;
