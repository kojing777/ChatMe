import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
<div className="h-screen w-80 xl:w-96 pt-16 px-2 -ml-2 -mt-2 overflow-y-auto">

      <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12 ring-2 ring-[#0095F6] ring-offset-2 hover:ring-offset-4 transition-all duration-300">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback className="bg-gradient-to-r from-[#0095F6] to-[#318bc7] text-white text-lg">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 text-base hover:text-[#0095F6] transition-colors duration-300">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm line-clamp-1">
            {user?.bio || "i'm MERN STACK developer"}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
