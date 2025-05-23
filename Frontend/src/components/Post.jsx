import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "./redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();
  const [comment, setComment] = useState(post.comments);

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:7000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // post update garni code

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id != user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:7000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id != post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="my-3 w-full max-w-md mx-auto bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 ring-1 ring-[#0095F6] ring-offset-1">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback className="bg-gradient-to-r from-[#0095F6] to-[#318bc7] text-white text-xs">
              {post.author?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-900 text-xs">{post.author?.username}</h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary" className="bg-[#0095F6]/10 text-[#0095F6] hover:bg-[#0095F6]/20 text-[10px] px-1">
                Author
              </Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className="cursor-pointer hover:text-[#0095F6] transition-colors duration-300 w-4 h-4" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-xs">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold hover:bg-red-50 text-xs"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit hover:bg-gray-50 text-xs">
              Add to Favourite
            </Button>
            {user && user._id === post?.author._id && (
              <Button
                variant="ghost"
                onClick={deletePostHandler}
                className="cursor-pointer w-fit hover:bg-red-50 text-[#ED4956] text-xs"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative group">
        <img
          className="w-full aspect-square object-cover transition-all duration-500"
          src={post.image}
          alt="post_image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="flex items-center gap-1">
              <FaHeart className="w-4 h-4" />
              <span className="font-semibold text-xs">{postLike}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold text-xs">{comment.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size="18"
                className="cursor-pointer text-red-600 hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size="18"
                className="cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-300"
              />
            )}

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-[#0095F6] hover:scale-110 transition-all duration-300 w-4 h-4"
            />
            <Send className="cursor-pointer hover:text-[#0095F6] hover:scale-110 transition-all duration-300 w-4 h-4" />
          </div>
          <Bookmark className="cursor-pointer hover:text-[#0095F6] hover:scale-110 transition-all duration-300 w-4 h-4" />
        </div>

        <span className="font-semibold text-gray-900 block mb-1 text-xs">{postLike} likes</span>
        <p className="text-gray-800 mb-1 text-xs">
          <span className="font-semibold mr-1">{post.author?.username}</span>
          {post.caption}
        </p>
        
        {comment.length > 0 && (
          <span
            className="cursor-pointer text-[10px] text-gray-500 hover:text-[#0095F6] transition-colors duration-300"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comment.length} Comments
          </span>
        )}

        <div className="flex items-center justify-between mt-2">
          <Input
            type="text"
            placeholder="Add comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-[10px] w-full"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-[#0095F6] font-semibold cursor-pointer hover:text-[#318bc7] transition-colors duration-300 text-xs"
            >
              Post
            </span>
          )}
        </div>
      </div>

      <CommentDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Post;
