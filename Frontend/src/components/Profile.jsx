import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const [greeting, setGreeting] = useState("");

  const { userProfile, user } = useSelector((store) => store.auth);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return "❤️Good Morning";
      } else if (hour >= 12 && hour < 17) {
        return "❤️Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        return "❤️Good Evening";
      } else {
        return "❤️Good Night";
      }
    };

    setGreeting(getGreeting());
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  //malai kei chaiyo vane hyaa bata change garni for edit profuile

  //
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto px-4 md:px-10">
      <div className="flex flex-col gap-10 md:gap-20 p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="flex items-center justify-center">
            <div className="relative group">
              <Avatar className="h-40 w-40 md:h-48 md:w-48 ring-4 ring-[#0095F6] ring-offset-2 transition-all duration-300 group-hover:ring-[#318bc7]">
                <AvatarImage
                  src={userProfile?.profilePicture}
                  alt="profilephoto"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-r from-[#0095F6] to-[#318bc7] text-white text-3xl">
                  {userProfile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </section>
          <section>
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0095F6] to-[#318bc7] bg-clip-text text-transparent">
                  {userProfile?.username}
                </h1>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8 text-sm transition-all duration-300 hover:scale-105"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 text-sm transition-all duration-300 hover:scale-105"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8 text-sm transition-all duration-300 hover:scale-105"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8 text-sm transition-all duration-300 hover:scale-105">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8 text-sm transition-all duration-300 hover:scale-105">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#318bc7] h-8 text-sm transition-all duration-300 hover:scale-105">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm md:text-base">
                <p className="hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-bold text-lg">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p className="hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-bold text-lg">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p className="hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-bold text-lg">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                <span className="font-semibold text-base md:text-lg">
                  {userProfile?.bio || "No bio yet"}
                </span>
                <Badge className="w-fit bg-gradient-to-r from-[#0095F6] to-[#318bc7] text-white hover:opacity-90 transition-all duration-300">
                  <AtSign className="mr-1" />
                  <span>{userProfile?.username}</span>
                </Badge>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-[#0095F6] font-medium">{greeting}</span>
                  {userProfile?.bioLine1 && (
                    <span className="text-gray-700">{userProfile.bioLine1}</span>
                  )}
                  {userProfile?.bioLine2 && (
                    <span className="text-gray-700">{userProfile.bioLine2}</span>
                  )}
                  {userProfile?.bioLine3 && (
                    <span className="text-gray-700">{userProfile.bioLine3}</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-4 md:gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer transition-all duration-300 hover:text-[#0095F6] relative ${
                activeTab === "posts" ? "font-bold text-[#0095F6]" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0095F6] transform origin-left transition-transform duration-300" />
              )}
            </span>
            <span
              className={`py-3 cursor-pointer transition-all duration-300 hover:text-[#0095F6] relative ${
                activeTab === "saved" ? "font-bold text-[#0095F6]" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0095F6] transform origin-left transition-transform duration-300" />
              )}
            </span>
            <span className="py-3 cursor-pointer transition-all duration-300 hover:text-[#0095F6] relative">
              REELS
            </span>
            <span className="py-3 cursor-pointer transition-all duration-300 hover:text-[#0095F6] relative">
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-4">
            {displayedPost?.map((post) => {
              return (
                <div 
                  key={post?._id} 
                  className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] bg-white"
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className="w-full aspect-square object-cover transition-all duration-500 group-hover:brightness-95"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center text-white space-x-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <button className="flex items-center gap-2 hover:text-[#0095F6] transition-all duration-300">
                        <Heart className="w-6 h-6" />
                        <span className="font-semibold text-lg">{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#0095F6] transition-all duration-300">
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-semibold text-lg">{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                  {post?.image && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
