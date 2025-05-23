import { setPosts } from "@/components/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/post/all',{withCredentials:true});
            console.log(res.data)
            if(res.data.success){
                dispatch(setPosts(res.data.posts))
            }
        } catch (error) {
            console.log(error)
        }
    };
    fetchAllPost();
  }),[]
};


export default useGetAllPost