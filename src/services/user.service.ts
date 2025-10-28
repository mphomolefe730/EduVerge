import httpClient from "./httpClient";

const UserService = {
    loginUser: ({ email, password} : {email:string,password:string}) => {
        return httpClient.post(`/users/login/`, { email:email, password:password})
    },
    registerUser: ( {firstName, lastName, email, password}: {firstName:string, lastName:string, email:string, password:string}) => {
        return httpClient.post(`/users/register/`, {firstName:firstName, lastName:lastName, email:email, password:password})
    },
    createUser: (user: any) => httpClient.post('/users', user),
    updateUser: (id: string, user: any) => httpClient.put(`/users/${id}`, user),
    deleteUser: (id: string) => httpClient.delete(`/users/${id}`),
};

export default UserService;