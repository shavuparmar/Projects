import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NavBar from '../Common/NavBar';
import './Profile.css';
import Userpic from '../Icon/user.png';

function Profile() {
  const [bio, setBio] = useState('Bio Contain');
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Assuming this is coming from context, ensure user is valid

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Don't fetch if user is undefined
      setIsLoading(true);
      setError(null);
      try {
        const userResponse = await axios.get(`/api/user/${user.id}`); // Assuming API returns user info by ID
        setBio(userResponse.data.bio || 'Bio Contain');
        const postsResponse = await axios.get(`/api/posts?username=${user.username}`);
        setPosts(postsResponse.data);
      } catch (err) {
        setError('Failed to load profile data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleBioChange = (e) => setBio(e.target.value);

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        // Assuming the API supports PATCH to update user bio
        await axios.patch(`/api/user/${user.id}`, { bio });
      } catch (err) {
        setError('Failed to save bio.');
        console.error(err);
      }
    }
    setIsEditing(!isEditing);
  };

  const followers = '10B'; // Mock data for followers
  const following = 0; // Mock data for following

  return (
    <div className="MainContain">
      <NavBar />
      <div className="Container">
        <div className="profile-container">
          <div className="profile-top">
            <div className="profile-image">
              <img src={Userpic} alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="top-row">
                <h2>{user?.username || 'Guest'}</h2>
                <button className="edit-btn" onClick={toggleEdit}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <span className="menu-icon">☰</span>
              </div>
              <div className="stats">
                <span>
                  <strong>{posts.length}</strong> Post{posts.length !== 1 ? 's' : ''}
                </span>
                <span>
                  <strong>{followers}</strong> Followers
                </span>
                <span>
                  <strong>{following}</strong> Following
                </span>
              </div>
              <div className="bio">
                {isEditing ? (
                  <div className="bio-edit">
                    <textarea value={bio} onChange={handleBioChange} rows="3" />
                    <button className="save-btn" onClick={toggleEdit}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="bio-display">
                    <p>{bio}</p>
                    <button className="bio-edit-btn" onClick={toggleEdit}>
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          <div className="post-grid">
            {posts.length === 0 && !isLoading ? (
              <p className="no-posts">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div className="post-item" key={post._id}>
                  {post.mediaType.startsWith('image') ? (
                    <img src={post.mediaUrl} alt="User Post" />
                  ) : (
                    <video src={post.mediaUrl} controls muted />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
