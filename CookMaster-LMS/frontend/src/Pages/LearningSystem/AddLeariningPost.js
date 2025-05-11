import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, X, FileText, Tag, Globe, AlertCircle, Loader, ArrowLeft, BookOpen, BarChart2, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import './LearningSystem.css';
import SideBar from '../../Components/SideBar/SideBar';

function AddLeariningPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includePoll, setIncludePoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('1d');
  const [pollQuestion, setPollQuestion] = useState('');
  const navigate = useNavigate();

  const MAX_DESCRIPTION_LENGTH = 1000;
  const MAX_POLL_OPTIONS = 6;

  const validateTitle = (value) => {
    // Only allow letters, numbers, spaces, and basic punctuation
    const titleRegex = /^[a-zA-Z0-9\s.,!?-]*$/;
    return titleRegex.test(value);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (validateTitle(value)) {
      setTitle(value);
      if (errors.title) setErrors({...errors, title: ''});
    } else {
      setErrors({...errors, title: 'Title can only contain letters, numbers, and basic punctuation'});
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      setErrors({...errors, description: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`});
    } else if (errors.description) {
      setErrors({...errors, description: ''});
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      if (errors.tags) setErrors({...errors, tags: ''});
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');
    
    // Validate form
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!validateTitle(title)) newErrors.title = 'Title contains invalid characters';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (description.length > MAX_DESCRIPTION_LENGTH) newErrors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
    if (!contentURL.trim()) newErrors.contentURL = 'Content URL is required';
    if (tags.length < 2) newErrors.tags = 'Please add at least two tags';
    
    // Validate poll if included
    if (includePoll) {
      const emptyOptions = pollOptions.filter(opt => !opt.trim());
      if (emptyOptions.length > 0) {
        newErrors.poll = 'All poll options must be filled';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/'); 
      return;
    }
    
    setIsSubmitting(true);
    const newPost = { 
      title, 
      description, 
      contentURL, 
      tags, 
      postOwnerID, 
      postOwnerName,
      poll: includePoll ? {
        options: pollOptions,
        duration: pollDuration
      } : null
    }; 
    
    try {
      await axios.post('http://localhost:8080/learningSystem', newPost);
      navigate('/learningSystem/allLearningPost');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="learning-container">
      <SideBar />
      <main>
        <div className="learning-header">
          <div className="learning-header-content">
            <button 
              className="learning-back-btn" 
              onClick={() => navigate('/learningSystem/allLearningPost')}
            >
              <ArrowLeft size={18} />
              Back to Posts
            </button>
            <h1 className="learning-title">Create Post</h1>
            <p className="learning-subtitle">Share your knowledge with the community</p>
          </div>
        </div>
        
        <div className="learning-form">
          <div className="learning-form-header">
            <h2 className="learning-form-title">New Post</h2>
            <p className="learning-form-subtitle">Share valuable resources with your peers</p>
          </div>
          
          <form onSubmit={handleSubmit} className="learning-form-content">
            <div className="learning-form-group">
              <label className="learning-label">
                <BookOpen size={18} />
                Title
              </label>
              <input
                type="text"
                className={`learning-input ${errors.title ? 'error' : ''} ${!validateTitle(title) ? 'invalid-format' : ''}`}
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter a descriptive title for your post"
                required
              />
              {errors.title && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.title}
                </div>
              )}
            </div>

            <div className="learning-form-group">
              <label className="learning-label">
                <Globe size={18} />
                Content URL
              </label>
              <input
                type="url"
                className={`learning-input ${errors.contentURL ? 'error' : ''}`}
                value={contentURL}
                onChange={(e) => {
                  setContentURL(e.target.value);
                  if (errors.contentURL) setErrors({...errors, contentURL: ''});
                }}
                placeholder="https://example.com/article"
                required
              />
              {errors.contentURL && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.contentURL}
                </div>
              )}
              <small className="learning-input-help">YouTube links will be embedded automatically</small>
            </div>

            <div className="learning-form-group">
              <label className="learning-label">
                <Tag size={18} />
                Tags
              </label>
              <div className={`learning-tags ${errors.tags ? 'error' : ''}`}>
                {tags.map((tag, index) => (
                  <div key={index} className="learning-tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(index)} 
                      className="learning-tag-remove"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="learning-tags-input">
  <input
    type="text"
    className="learning-input"
    value={tagInput}
    onChange={(e) => setTagInput(e.target.value)}
    placeholder="Add tags (press Enter)"
    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
    style={{ color: 'black' }} // Inline style to set text color to black
  />
  <button 
    type="button" 
    onClick={handleAddTag} 
    className="learning-btn-secondary"
  >
    Add
  </button>
</div>

              {errors.tags && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.tags}
                </div>
              )}
              <small className="learning-input-help">Add at least 2 tags to categorize your post</small>
            </div>

            <div className="learning-form-group">
              <label className="learning-label">
                <FileText size={18} />
                Description
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className={`learning-textarea ${errors.description ? 'error' : ''} ${description.length > MAX_DESCRIPTION_LENGTH ? 'max-length' : ''}`}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Write a detailed description of this learning resource"
                  rows={5}
                  required
                />
                <div className={`character-count ${description.length > MAX_DESCRIPTION_LENGTH ? 'error' : description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'warning' : ''}`}>
                  {description.length}/{MAX_DESCRIPTION_LENGTH}
                </div>
              </div>
              {errors.description && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}

              <div className="learning-poll-toggle">
                <button
                  type="button"
                  className={`learning-btn learning-btn-secondary ${includePoll ? 'active' : ''}`}
                  onClick={() => setIncludePoll(!includePoll)}
                >
                  {includePoll ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>Add Poll</span>
                </button>
              </div>

              {includePoll && (
                <div className="learning-poll-section">
                  <div className="learning-poll-header">
                    <BarChart2 size={18} />
                    <span className="learning-poll-title">Create Poll</span>
                  </div>

                  <div className="learning-form-group">
                    <input
                      type="text"
                      className="learning-input"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      required={includePoll}
                    />
                  </div>

                  <div className="learning-poll-options">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="learning-poll-option">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          required={includePoll}
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            className="learning-poll-option-remove"
                            onClick={() => handleRemovePollOption(index)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 6 && (
                      <button
                        type="button"
                        className="learning-poll-add-option"
                        onClick={handleAddPollOption}
                      >
                        <Plus size={16} />
                        Add Option
                      </button>
                    )}
                  </div>

                  <div className="learning-poll-duration">
                    <div className="learning-poll-header">
                      <Clock size={18} />
                      <span className="learning-poll-title">Poll Duration</span>
                    </div>
                    <select
                      value={pollDuration}
                      onChange={(e) => setPollDuration(e.target.value)}
                    >
                      <option value="1d">1 Day</option>
                      <option value="3d">3 Days</option>
                      <option value="7d">1 Week</option>
                      <option value="14d">2 Weeks</option>
                      <option value="30d">1 Month</option>
                    </select>
                  </div>

                  {errors.poll && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.poll}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="learning-form-actions">
              <button 
                type="button" 
                className="learning-btn learning-btn-secondary"
                onClick={() => navigate('/learningSystem/allLearningPost')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="learning-btn learning-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="learning-loading-spinner" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Create Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddLeariningPost;