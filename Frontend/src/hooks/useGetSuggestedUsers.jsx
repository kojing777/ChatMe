import { setSuggestedUsers } from "@/components/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUSers = () => {
const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/user/suggested',{withCredentials:true});
            console.log(res.data)
            if(res.data.success){
                dispatch(setSuggestedUsers(res.data.users))
            }
        } catch (error) {
            console.log(error)
        }
    };
    fetchSuggestedUsers();
  }),[]
};


export default useGetSuggestedUSers