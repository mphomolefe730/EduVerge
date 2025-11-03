import httpClient from "./httpClient";

const StudyGroupService = {
    getAllUserGroups: async (userId: string) => {
        return await httpClient.get(`/study-groups/user/${userId}`);
    },
    getAllStudyGroups: async () => {
        return await httpClient.get(`/study-groups`);
    },
    searchForStudyGroup: async (searchQuery:string) =>{
        return await httpClient.get(`/study-groups/search-by-query/${searchQuery}`);
    },
    joinStudyGroup: async (groupId:string, userId:string)=>{
        return await httpClient.post(`/join/${groupId}`, userId)
    }
}

export default StudyGroupService;