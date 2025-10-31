import httpClient from "./httpClient";

const UserService = {
    loginUser: ({ email, password} : {email:string,password:string}) => {
        return httpClient.post(`/users/login`, { email:email, password:password })
    },
    registerUser: ( {username, email, password, userType, profilePicture}: {username:string, email:string, userType:string, password:string, profilePicture:string}) => {
        return httpClient.post(`/users`, {username:username, email:email, password:password, profilePicture: profilePicture, userType:userType})
    },
    // createUser: (user: any) => httpClient.post('/api/users', user),
    // updateUser: (id: string, user: any) => httpClient.put(`/users/${id}`, user),
    // deleteUser: (id: string) => httpClient.delete(`/users/${id}`),
};

export default UserService;