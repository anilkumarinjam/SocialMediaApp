"use client";

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useRouter } from 'next/navigation';

const DeletedPosts = () => {
  const [deletedPosts, setDeletedPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedPosts = async () => {
      try {
        const response = await axiosInstance.get('/posts/deleted');
        setDeletedPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching deleted posts:', error);
      }
    };

    fetchDeletedPosts();
  }, []);

  const handleRestore = async (postId) => {
    try {
      await axiosInstance.put(`/posts/${postId}/restore`);
      setDeletedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert('Post restored successfully!');
    } catch (error) {
      console.error('Error restoring post:', error);
      alert('Failed to restore post.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Deleted Posts</h1>
        {deletedPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No deleted posts found.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {deletedPosts.map((post) => (
              <li key={post._id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{post.content}</h2>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                )}
                <button
                  onClick={() => handleRestore(post._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Restore Post
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeletedPosts;
