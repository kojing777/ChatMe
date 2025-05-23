import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 my-3 flex flex-col items-center px-4 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-lg">
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
