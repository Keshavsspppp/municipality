import { useState, useEffect, useRef } from 'react';
import { getForums, getForum, createForum, updateForum, deleteForum, createPost, updatePost, deletePost, getForumMessages } from '../services/api';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import io from 'socket.io-client'; // Import Socket.IO client

// Assuming your backend Socket.IO server is running on http://localhost:5000
const SOCKET_SERVER_URL = 'http://localhost:5000';

export default function Forum() {
  const { user } = useUser();
  const [forums, setForums] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForum, setSelectedForum] = useState(null); // State to hold the forum selected for chat
  const [messages, setMessages] = useState([]); // State to hold messages for the selected forum
  const [newMessage, setNewMessage] = useState(''); // State for the current message being typed
  const socketRef = useRef(); // Ref to hold the Socket.IO client instance
  const messagesEndRef = useRef(null); // Ref for the end of messages

  // Effect for fetching forums initially
  useEffect(() => {
    const loadForums = async () => {
      try {
        setLoading(true);
        const response = await getForums();
        if (response.success) {
          setForums(response.data);
          console.log('Fetched forums:', response.data.length);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch forums');
        }
      } catch (err) {
        setError('Failed to fetch forums. Please ensure the backend is running and accessible.');
        console.error('Error fetching forums:', err);
      } finally {
        setLoading(false);
      }
    };

    loadForums();
  }, []);

  // Effect for Socket.IO connection and message handling
  useEffect(() => {
    // Only initialize Socket.IO connection if user is available
    if (!user) {
      console.log('User not available, skipping Socket.IO connection.');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    console.log('User available, initializing Socket.IO connection for user:', user.id);
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { userId: user.id }, // Pass user ID for authentication/identification
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 45000,
      withCredentials: true
    });

    // Event listener for receiving messages
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Event listener for successful connection
    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      setError(null); // Clear any previous connection errors related to socket
    });

    // Event listener for disconnection
    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected due to:', reason);
      // Optional: Handle specific disconnection reasons if needed
    });

    // Event listener for connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError('Failed to connect to chat server. Please check if the server is running.');
    });

    // Event listener for reconnection attempts
    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Attempting to reconnect (${attemptNumber})...`);
    });

    // Event listener for successful reconnection
    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      setError(null); // Clear error on successful reconnection
    });

    // Clean up on component unmount or when user changes
    return () => {
      console.log('Cleaning up Socket.IO connection');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };

  }, [user]); // Changed dependency array to include user

  // Effect to scroll to the bottom of the messages whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to join a forum room when selectedForum changes
  useEffect(() => {
    if (socketRef.current && selectedForum) {
      // Leave previous room if any
      if (socketRef.current.currentRoom) {
        socketRef.current.emit('leaveRoom', socketRef.current.currentRoom);
        console.log(`Left room ${socketRef.current.currentRoom}`);
      }
      // Join the new forum room
      const roomName = selectedForum._id; // Use forum ID as room name
      socketRef.current.emit('joinRoom', roomName);
      socketRef.current.currentRoom = roomName; // Store current room name
      console.log(`Joined room ${roomName}`);

      // Fetch message history for this room from the backend
      const fetchMessages = async () => {
        try {
          // Assuming you have an API function like getForumMessages in api.js
          const response = await getForumMessages(selectedForum._id);
          if (response.success) {
            setMessages(response.data);
          } else {
            console.error('Failed to fetch messages:', response.message);
            setMessages([]); // Clear messages on error
          }
        } catch (err) {
          console.error('Error fetching messages:', err);
          setMessages([]); // Clear messages on error
        }
      };
      fetchMessages();

    }
  }, [selectedForum]); // Re-run effect when selectedForum changes

  // Function to handle clicking on a forum row (to open chat)
  const handleForumClick = (forum) => {
    setSelectedForum(forum);
    // Close any open modals if applicable
    // setIsModalOpen(false);
  };

  // Function to handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current && selectedForum && user) {
      const messageData = {
        text: newMessage,
        forumId: selectedForum._id,
        // Include author information
        author: { _id: user.id, name: user.fullName || user.username || 'Anonymous' },
      };
      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  // Function to go back to the forum list
  const handleBackToForums = () => {
    if (socketRef.current && socketRef.current.currentRoom) {
      socketRef.current.emit('leaveRoom', socketRef.current.currentRoom);
      socketRef.current.currentRoom = null;
    }
    setSelectedForum(null);
    setMessages([]);
    setError(null); // Clear any errors specific to chat
  };

  const filteredForums = forums.filter(forum => {
    if (filter === 'all') return true;
    return forum.type.toLowerCase() === filter.toLowerCase();
  });

  const renderLastActivity = (topics) => {
    if (!topics || topics.length === 0) return 'No activity';
    // Find the most recent topic
    const latestTopic = topics.reduce((latest, topic) => {
      return new Date(topic.createdAt) > new Date(latest.createdAt) ? topic : latest;
    }, topics[0]);

    // If the latest topic has posts, find the most recent post
    if (latestTopic.posts && latestTopic.posts.length > 0) {
      const latestPost = latestTopic.posts.reduce((latest, post) => {
         return new Date(post.createdAt) > new Date(latest.createdAt) ? post : latest;
      }, latestTopic.posts[0]);
       return format(new Date(latestPost.createdAt), 'MMM d, yyyy, h:mm a');
    }
    // Otherwise, use the topic creation date
    return format(new Date(latestTopic.createdAt), 'MMM d, yyyy, h:mm a');
  };

  // Removed modal related state and handlers for chat view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: ''
  });

  const handleNewTopicClick = (forum) => {
    // This handler could be repurposed or removed depending on how you want to handle topics vs chat
    // For now, keeping it separate from chat view
    console.log('New topic functionality - not chat', forum);
    // Example: navigate to a new topic creation page or open a specific topic modal
     alert('New Topic functionality is separate from real-time chat for now.');
  };

  const handleGlobalNewTopicClick = () => {
     console.log('Global new topic click');
     alert('Global New Topic functionality is separate from real-time chat for now.');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // --- Conditional Rendering: Forum List or Chat View ---

  if (selectedForum) {
    // Render Chat View
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between bg-gray-200 p-4">
          <button onClick={handleBackToForums} className="text-blue-600 hover:text-blue-800">← Back to Forums</button>
          <h2 className="text-xl font-semibold">Chat: {selectedForum.name}</h2>
          <div></div> {/* Placeholder for potential right-side elements */}
        </div>
         {error && (
            <div className="text-sm text-red-600 p-4">Error: {error}</div>
          )}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
          {/* Display Messages */}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.author && message.author._id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-xs ${message.author && message.author._id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                <p className="text-sm">{message.text}</p>
                {/* Display author name and avatar if available */}
                {message.author && (
                  <div className="flex items-center mt-1 text-xs opacity-75">
                    {message.author.avatar ? (
                      <img src={message.author.avatar} alt={`${message.author.name}'s avatar`} className="w-6 h-6 rounded-full mr-2" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold mr-2">
                        {message.author.name ? message.author.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                    <span>{message.author.name || 'Anonymous'}</span>
                  </div>
                )}
                 {/* Display timestamp */}
                 <p className="text-xs mt-1 opacity-75 text-right">{format(new Date(message.createdAt), 'h:mm a')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Area */}
        <div className="bg-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
              disabled={!socketRef.current || !user}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus::ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim() || !socketRef.current || !user}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Forum List View (default)
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Forum</h1>
          <p className="mt-2 text-sm text-gray-700">
            Discussion board with intra-department, inter-department, and public forum sections.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleGlobalNewTopicClick}
            disabled={forums.length === 0}
            className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto ${ forums.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            New Topic
          </button>
          {forums.length === 0 && !loading && error === null && (
            <div className="text-xs text-gray-500 mt-1">No forums available. Please add a forum in the database.</div>
          )}
           {error && (
            <div className="text-sm text-red-600 mt-2">Error: {error}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Forums
        </button>
        <button
          onClick={() => setFilter('intra')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'intra' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Intra-Department
        </button>
        <button
          onClick={() => setFilter('inter')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'inter' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Inter-Department
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'public' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Public
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Forum
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Topics
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Posts
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Activity
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredForums.map((forum) => (
                    <tr
                      key={forum._id}
                      onClick={() => handleForumClick(forum)} // Add click handler to open chat
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{forum.name}</div>
                        <div className="text-gray-500">{forum.description}</div>
                        {forum.type === 'Intra' && forum.department && ( 
                          <div className="mt-1 text-xs text-gray-500">
                            Department: {forum.department.name}
                          </div>
                        )}
                        {forum.type === 'Inter' && forum.departments && (
                          <div className="mt-1 text-xs text-gray-500">
                            Departments: {forum.departments.map(d => d.name).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          forum.type === 'Intra' ? 'bg-blue-100 text-blue-800' :
                          forum.type === 'Inter' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {forum.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {forum.topics ? forum.topics.length : 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {forum.topics ? forum.topics.reduce((total, topic) => total + (topic.posts ? topic.posts.length : 0), 0) : 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {renderLastActivity(forum.topics)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {/* Repurposing or removing the New Topic button might be needed */}
                        {/* For now, keeping it but note it's separate from chat */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleNewTopicClick(forum);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          New Topic<span className="sr-only">, {forum.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Topic Modal - Removed as we focus on chat view */}
      {/* {isModalOpen && (...)} */}

    </div>
  );
} 