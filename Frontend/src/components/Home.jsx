import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUSers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUSers();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex justify-end">
        <div className="w-full max-w-3xl mr-8">
          <Feed />
          <Outlet />
        </div>
      </div>
      <div className="hidden lg:block w-80 xl:w-96">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
