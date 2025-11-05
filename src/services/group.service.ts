import httpClient from "./httpClient"

const GroupService = {
    createNewGroup: (groupData:any) => {
        console.log(groupData);
        return httpClient.post(`/study-groups/create`, groupData)
    },
    
}
export default GroupService;