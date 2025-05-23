import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlaySquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "./redux/postSlice";
import chat from "../assets/chat.png";

const LeftsideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlaySquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            {user?.username?.slice(0, 2).toUpperCase() || "US"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-center">
          <img 
            src={chat}
            alt="EGO" 
            className="h-18 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-2 flex flex-col items-center">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="w-full max-w-[200px] flex items-center gap-4 relative group cursor-pointer rounded-xl p-3 my-1.5 transition-all duration-300 hover:bg-gray-50"
            >
              <div className="text-gray-600 group-hover:text-[#0095F6] transition-colors duration-300 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="capitalize text-gray-700 group-hover:text-[#0095F6] font-medium text-base transition-colors duration-300">
                {item.text}
              </span>
              <div className="absolute left-0 w-1 h-0 bg-[#0095F6] rounded-r-full transition-all duration-300 group-hover:h-full" />
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} alt="@shadcn" />
              <AvatarFallback className="bg-gradient-to-r from-[#0095F6] to-[#318bc7] text-white text-lg">
                {user?.username?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate">
                {user?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftsideBar;
