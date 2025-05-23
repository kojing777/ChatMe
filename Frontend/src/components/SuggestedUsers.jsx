import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Array of gradient colors for profile borders
  const gradientColors = [
    "from-[#0095F6] to-[#318bc7]",
    "from-[#E1306C] to-[#F77737]",
    "from-[#833AB4] to-[#FD1D1D]",
    "from-[#405DE6] to-[#5851DB]",
    "from-[#FCAF45] to-[#F77737]",
    "from-[#833AB4] to-[#C13584]",
    "from-[#405DE6] to-[#5B51D8]",
    "from-[#E1306C] to-[#C13584]",
  ];

  // Function to get random gradient
  const getRandomGradient = (index) => {
    return gradientColors[index % gradientColors.length];
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-gray-600 text-base">Suggested for you</h1>
        <Button variant="ghost" className="text-[#0095F6] hover:text-[#318bc7] hover:bg-[#0095F6]/10 text-sm font-medium">
          See All
        </Button>
      </div>
      
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div
            key={user._id}
            className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className={`w-10 h-10 ring-1 ring-offset-1 group-hover:ring-offset-2 transition-all duration-300`}>
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${getRandomGradient(index)} p-[2px]`}>
                    <div className="w-full h-full rounded-full bg-white p-[1px]">
                      <AvatarImage src={user?.profilePicture} alt="profile" className="rounded-full" />
                      <AvatarFallback className={`bg-gradient-to-r ${getRandomGradient(index)} text-white text-sm rounded-full`}>
                        {user?.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </div>
                  </div>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-gray-900 text-sm group-hover:text-[#0095F6] transition-colors duration-300">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-xs line-clamp-1">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-[#0095F6] hover:text-white hover:bg-[#0095F6] text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
