import httpClient from "./httpClient";

const UserService = {
    loginUser: ({ email, password} : {email:string,password:string}) => {
        return httpClient.post(`/users/login`, { email:email, password:password })
    },
    registerUser: ( {username, email, password, userType, profilePicture}: {username:string, email:string, userType:string, password:string, profilePicture:string}) => {
        return httpClient.post(`/users`, {username:username, email:email, password:password, profilePicture: profilePicture, userType:userType})
    },
    signOut: () => {
        sessionStorage.removeItem("EduVergeToken");
    },
    checkLogin: () => {
        const token = sessionStorage.getItem('EduVergeToken');
        if(!token){
            return            
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
    
    },
    hasPermission: (permissionType:string)=>{
        const userObj = UserService.checkLogin()
        if (userObj.userType === permissionType || userObj === "admin"){
            return true;
        }
        return false;
    }
};

export default UserService;