import { useEffect, useState, useRef } from "react"
import StudyGroupService from "../../../services/studyGroup.service"
import UserService from "../../../services/user.service"
import ChatService from "../../../services/chat.service"
import { useNavigate } from "react-router-dom";

// Date utilities for message timestamps
const DateUtils = {
  formatMessageTime: (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  },
  
  formatMessageDate: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export default function ChatView() {
    const navigate = useNavigate();
    const [studyGroups, setStudyGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);
    
    // Auto-refresh every 2 minutes
    const useAutoRefresh = (callback, intervalMs = 120000) => {
        const savedCallback = useRef();
        
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        
        useEffect(() => {
            const tick = () => savedCallback.current?.();
            const intervalId = setInterval(tick, intervalMs);
            return () => clearInterval(intervalId);
        }, [intervalMs]);
    };
    
    useAutoRefresh(() => {
        if (selectedGroup) {
            loadMessages(selectedGroup.id);
        }
        loadStudyGroups();
    });
    
    useEffect(() => {
        const userInformation = UserService.checkLogin();
        if (userInformation) {
            setCurrentUser(userInformation);
            loadStudyGroups();
        } else {
            navigate("/login");
        }
    }, []);
    
    useEffect(() => {
        if (selectedGroup) {
            loadMessages(selectedGroup.id);
        }
    }, [selectedGroup]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const loadStudyGroups = async () => {
        try {
            const userInformation = UserService.checkLogin();
            const res = await StudyGroupService.getAllUserGroups(userInformation.id);
            setStudyGroups(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    const loadMessages = async (groupId) => {
        try {
            const res = await ChatService.getGroupMessages(groupId);
            setMessages(res.data || []);
        } catch (error) {
            console.log('Error loading messages:', error);
        }
    };
    
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedGroup || !currentUser) return;
        
        try {
            const messageData = {
                studyGroupId: selectedGroup.id,
                senderId: currentUser.id,
                message: newMessage.trim(),
                messageType: 'text'
            };
            
            await ChatService.sendMessage(messageData);
            setNewMessage('');
            loadMessages(selectedGroup.id);
        } catch (error) {
            console.log('Error sending message:', error);
        }
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
            <div className="max-w-6xl mx-auto h-screen flex">
                {/* Sidebar - Groups List */}
                <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h1 className="text-xl font-bold text-slate-900">Study Groups</h1>
                        <p className="text-slate-600 text-sm mt-1">Your active conversations</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {studyGroups.map((group) => (
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                                    selectedGroup?.id === group.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{group.groupName}</h3>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">{group.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                group.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                                                group.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {group.difficulty}
                                            </span>
                                            <span className="inline-block px-2 py-1 rounded-full bg-slate-50 text-slate-600 text-xs">
                                                {group.maxMembers} max
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedGroup ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200 bg-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-slate-900">{selectedGroup.groupName}</h2>
                                        <p className="text-sm text-slate-600">{selectedGroup.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            selectedGroup.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                            selectedGroup.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {selectedGroup.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                                                    message.senderId === currentUser?.id
                                                        ? 'bg-blue-600 text-white rounded-br-none'
                                                        : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                                                }`}
                                            >
                                                {message.messageType === 'text' ? (
                                                    <p className="text-sm">{message.message}</p>
                                                ) : message.messageType === 'file' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                            📎
                                                        </div>
                                                        <a
                                                            href={message.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm underline hover:text-blue-200"
                                                        >
                                                            Download File
                                                        </a>
                                                    </div>
                                                ) : null}
                                                <div
                                                    className={`text-xs mt-1 ${
                                                        message.senderId === currentUser?.id
                                                            ? 'text-blue-200'
                                                            : 'text-slate-500'
                                                    }`}
                                                >
                                                    {DateUtils.formatMessageTime(new Date(message.sentAt))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            
                            {/* Message Input */}
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <div className="flex gap-2">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={1}
                                        style={{ minHeight: '40px', maxHeight: '120px' }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    💬
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Study Group</h3>
                                <p className="text-slate-600">Choose a group from the sidebar to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}