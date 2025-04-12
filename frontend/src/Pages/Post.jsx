import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NavBar from '../Common/NavBar';
import '../Post.css';
import '../index.css';

function PostUploader() {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [commentText, setCommentText] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchPosts();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image') || file.type.startsWith('video'))) {
      const url = URL.createObjectURL(file);
      setMedia({ file, url, type: file.type });
      setError(null);
    } else {
      setError('Please upload an image or video file.');
      setMedia(null);
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!media) {
      setError('Please select a media file.');
      return;
    }

    setIsLoading(true);
    setUploadStatus('');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('media', media.file);
      formData.append('caption', caption);

      const response = await axios.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPosts([response.data, ...posts]);
      setUploadStatus('Post uploaded successfully!');
      if (media.url) URL.revokeObjectURL(media.url);
      setMedia(null);
      setCaption('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload post.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.patch(`/api/posts/${postId}/like`);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      setError('Failed to like post.');
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        text: commentText,
      });
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment.');
      console.error(err);
    }
  };

  return (
    <div className="post-upload-container MainContain">
      <NavBar />
      <h2>Create a Post</h2>
      {error && <p className="error">{error}</p>}
      {uploadStatus && <p className="success">{uploadStatus}</p>}
      {isLoading && <p>Loading...</p>}

      <form onSubmit={handlePostSubmit}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={handleCaptionChange}
          disabled={isLoading}
        ></textarea>
        <button type="submit" disabled={isLoading || !media}>
          {isLoading ? 'Uploading...' : 'Post'}
        </button>
      </form>

      {media && (
        <div className="preview">
          {media.type.startsWith('image') ? (
            <img src={media.url} alt="Uploaded Preview" />
          ) : (
            <video src={media.url} controls />
          )}
        </div>
      )}

      <div className="posts-section">
        <h2>Posts</h2>
        {posts.length === 0 && !isLoading && <p>No posts yet.</p>}
        {posts.map((post) => (
          <div key={post._id} className="post-preview">
            <h3>{post.username}</h3>
            {post.mediaType.startsWith('image') ? (
              <img src={post.mediaUrl} alt="Post Media" />
            ) : (
              <video src={post.mediaUrl} controls />
            )}
            <p className="caption">{post.caption}</p>

            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}>
                ❤️ {post.likes}
              </button>
              <button>💬 {post.comments.length}</button>
              <button>🔄 Share</button>
            </div>

            <form
              className="comment-form"
              onSubmit={(e) => handleCommentSubmit(e, post._id)}
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                Post
              </button>
            </form>

            <div className="comments">
              {post.comments.map((cmt, idx) => (
                <p key={idx}>
                  <strong>{cmt.username}</strong>: {cmt.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostUploader;