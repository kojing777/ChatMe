import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "./redux/postSlice";
import Posts from "./Posts";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setFile(file);
        const dataUrl = await readAsDataURL(file);
        setImagePreview(dataUrl);
      } catch (error) {
        toast.error("Failed to process the image");
        console.error("Image processing error:", error);
      }
    }
  };

  const createPostHandler = async (e) => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file); // Append the file directly

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:7000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts,]))
        toast.success(res.data.message);
        setOpen(false); // Close dialog on success
        setCaption(""); // Reset form
        setImagePreview("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.error("Post creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogTitle className="text-center font-semibold">
          Create New Post
        </DialogTitle>
        <DialogDescription className="sr-only">
          Create a new post with image and caption
        </DialogDescription>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="user-avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="font-semibold text-gray-600">{user?.bio || 'No bio yet'}</span>
          </div>
        </div>

        <Textarea
          className="focus-visible:ring-transparent border-none mt-4"
          placeholder="Write a Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center mt-4">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-80 w-full object-contain rounded-md"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
          accept="image/*"
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#0095f6] mt-4"
          disabled={loading}
        >
          Select from Computer
        </Button>

        {imagePreview && (
          <Button
            onClick={createPostHandler}
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
