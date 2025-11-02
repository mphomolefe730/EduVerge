import httpClient from "./httpClient";

const StudyGroupService = {
    getAllUserGroups: async (userId: string) => {
        return await httpClient.get(`/study-groups/user/${userId}`);
    }
}

export default StudyGroupService;