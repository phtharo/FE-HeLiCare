//check logic create new post when FE-BE intergration 
// create, edit post
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ResidentSelector from "../components/ui/ResidentSelector";

// Unified Post interface
interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  time: string;
  likes: number;
  comments: string[];
  residentIds: string[];
  visibility: "STAFF_ONLY" | "STAFF_AND_FAMILY_OF_RESIDENTS" | "PUBLIC";
}

interface FormData {
  title: string;
  content: string;
  tags: string[];
  images: string[];
  residents: string[];
}

const StaffCreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = Boolean(postId);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    tags: [],
    images: [],
    residents: [],
  });

  useEffect(() => {
    if (!isEditMode || !postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const postToEdit: Post = await res.json();

        setFormData({
          title: postToEdit.title,
          content: postToEdit.content,
          tags: postToEdit.tags,
          images: postToEdit.imageUrl ? [postToEdit.imageUrl] : [],
          residents: postToEdit.residentIds,
        });
      } catch (error) {
        console.error(error);
        alert("Post not found");
        navigate("/newsfeed");
      }
    };

    fetchPost();
  }, [isEditMode, postId, navigate]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || formData.residents.length === 0) {
      alert("Please fill in title, content, and select at least one resident.");
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      residentIds: formData.residents,
      imageUrls: formData.images,
    };

    try {
      if (isEditMode && postId) {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update post");
      } else {
        const res = await fetch(`/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create post");
      }

      navigate("/newsfeed");
    } catch (e) {
      console.error(e);
      alert("Failed to save post");
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const uploadedImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    }
  };

  return (
    <div className="flex-1 flex flex-col w-[1200px] overflow-x-hidden rounded-xl mx-auto p-8">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Residents */}
          <ResidentSelector
            selectedResidentIds={formData.residents}
            onChange={(ids: string[]) => {
              setFormData((prev) => ({
                ...prev,
                residents: ids,
              }));
            }}
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-left mb-2">Tags (Room / Activity / Shift)</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter tag (e.g., Morning Yoga)"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: String(e.target.value).split(/,\s*/).filter(Boolean) }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-left mb-2">Title</label>
            <Input
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-left mb-2">Content</label>
            <Textarea
              placeholder="Enter detailed content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-left mb-2">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
            {formData.images && formData.images.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Image preview:</p>
                <img src={formData.images[0]} alt="preview" className="w-full h-40 object-cover rounded" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/newsfeed")}>Cancel</Button>
          <Button onClick={handleSave} style={{ backgroundColor: "#5985d8" }}>Save Post</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StaffCreatePost;
