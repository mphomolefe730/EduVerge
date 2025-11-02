import httpClient from "./httpClient";

const StudyGroupService = {
    getAllUserGroups: async (userId: string) => {
        return await httpClient.get(`/study-groups/user/${userId}`);
    },
    getAllStudyGroups: async () => {
        return await httpClient.get(`/study-groups`);
    }
}

export default StudyGroupService;