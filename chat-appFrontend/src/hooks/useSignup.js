import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () =>{
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signUp = async({fullName,userName,password,confirmPassword,gender}) =>{
        const success = handleInputErrors({fullName,userName,password,confirmPassword,gender})

        if(!success) return;

        try {
            const res = await fetch("/api/auth/signup",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({fullName,userName,password,confirmPassword,gender})
            })

            const data = await res.json();
            console.log(data)
            if(data.error){
                throw new Error(data.error)
            }
            //localstorage error
            localStorage.setItem("chat-user",JSON.stringify(data));
            //context
            setAuthUser(data);
            toast.success("Signup Successfull");

        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false);
        }
    };
    return {loading,signUp};

}
export default useSignup

function handleInputErrors({fullName,userName,password,confirmPassword,gender}){
    if(!fullName || !userName || !password || !confirmPassword || !gender){
        toast.error('Please fill in all Fields')
        return false
    }
    if(password !== confirmPassword){
        toast.error('Passwords do not match')
        return false
    }

    if(password.length<6){
        toast.error('Password must be at least 6 characters')
        return false
    }

    return true
}