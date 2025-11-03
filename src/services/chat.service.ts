import httpClient from "./httpClient"

const ChatService = {
    getGroupMessages: async (groupId:string)=>{
        return await httpClient.get(`/chat/group/${groupId}`);
    },
    sendMessage: async (messageData: { studyGroupId: any, senderId: any, message: string, messageType: string })=>{
        return await httpClient.post('/chat', messageData);
    }
}

export default ChatService;