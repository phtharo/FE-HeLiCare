import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"; // Assuming Dialog components exist in ui

type UserRole = "Resident" | "Family" | "Staff" | "Admin";

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  tags: string[];
  time: string;
  likes: number;
  comments: string[];
  authorName?: string;
  authorRole?: UserRole;
  residentName?: string;
  room?: string;
  canEdit?: boolean;
}

// Sample data updated for Staff context
const samplePosts: Post[] = [
  {
    id: 1,
    title: "Morning Yoga Session",
    content: "Participated in the morning yoga session, blood pressure stable at 120/80.",
    image: "https://via.placeholder.com/400x200",
    tags: ["Morning Yoga", "Room 203"],
    time: "08:00, 15/10/2023",
    likes: 5,
    comments: ["So happy!"],
    authorName: "Staff Member",
    authorRole: "Staff",
    residentName: "Nguyen Thi Thoa",
    room: "Room 203",
    canEdit: true, // Assuming this post is editable by Staff
  },
  {
    id: 2,
    title: "Lunch: Fiber-Rich Menu",
    content: "Residents had a nutritious lunch, positive feedback received.",
    image: "https://via.placeholder.com/400x200",
    tags: ["Nutrition"],
    time: "12:00, 15/10/2023",
    likes: 3,
    comments: ["Good!"],
    authorName: "Staff Member",
    authorRole: "Staff",
    residentName: "Nguyen Thi Thoa",
    room: "Room 301",
    canEdit: true,
  },
];

interface SidebarFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  userRole: UserRole;
  onCreatePost: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filter,
  setFilter,
  search,
  setSearch,
  userRole,
  onCreatePost,
}) => (
  <aside className="flex-shrink-0 w-72 bg-white p-4 border overflow-y-auto min-h-screen">
    <h3 className="text-lg font-semibold mb-4">Filters</h3>
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-full h-9">
        <SelectValue placeholder="Select time period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Day">Day</SelectItem>
        <SelectItem value="Week">Week</SelectItem>
        <SelectItem value="Month">Month</SelectItem>
      </SelectContent>
    </Select>
    <Input
      placeholder="Search posts..."
      value={search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      className="mt-4 w-full h-9 text-sm"
    />
    {(userRole === "Staff" || userRole === "Resident") && (
      <Button
        className="mt-4 w-full h-9 text-sm"
        style={{ backgroundColor: "#5985d8" }}
        onClick={onCreatePost}
      >
        Create New Post
      </Button>
    )}
  </aside>
);

interface ResidentInfoCardProps {
  residentName: string;
  room: string;
}

const ResidentInfoCard: React.FC<ResidentInfoCardProps> = ({ residentName, room }) => (
  <div className="mt-6 space-y-4 bg-white border border-gray-300 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">
      <Avatar>
        <AvatarImage src="https://via.placeholder.com/100" alt="Resident" />
        <AvatarFallback>R</AvatarFallback>
      </Avatar>
    </div>
    <p className="text-lg font-semibold text-gray-800">{residentName}</p>
    <p className="text-sm text-gray-600">{room}</p>
    <p className="text-xs text-gray-500">Online</p>
    <hr className="my-2 border-gray-300" />
    <p className="text-sm text-gray-600">Last activity: Today, 10:30 AM</p>
    <Button
      variant="outline"
      size="sm"
      className="mt-2 text-xs border-blue-500 text-blue-500 hover:bg-blue-100"
    >
      View Profile
    </Button>
  </div>
);

interface CommentListProps {
  comments: string[];
  userRole: UserRole;
}

const CommentList: React.FC<CommentListProps> = ({ comments, userRole }) => (
  <div className="mt-2 space-y-1">
    {comments.map((comment, idx) => (
      <div key={idx} className="flex items-start gap-2">
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/40" alt="Commenter" />
          <AvatarFallback>{userRole[0]}</AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-1 text-xs text-gray-600 leading-snug text-left max-w-xs">
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            {userRole}
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              {userRole}
            </Badge>
          </p>
          {comment}
        </div>
      </div>
    ))}
  </div>
);

interface CommentInputProps {
  onAddComment: (comment: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onAddComment }) => {
  const [comment, setComment] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && comment.trim() !== "") {
      onAddComment(comment.trim());
      setComment("");
    }
  };

  return (
    <Input
      placeholder="Write a comment..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full h-9 text-sm mt-4"
    />
  );
};

interface PostCardProps {
  post: Post;
  isStaff: boolean;
  onLike: (id: number) => void;
  onAddComment: (id: number, comment: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  liked: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isStaff,
  onLike,
  onAddComment,
  onEdit,
  onDelete,
  liked,
}) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/40" alt="Resident" />
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-800">{post.residentName || "Unknown"}</p>
          <p className="text-xs text-gray-500">{post.time}</p>
        </div>
        <div className="flex flex-wrap gap-2 ml-5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
        {isStaff && post.canEdit && (
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(post.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>
      <CardTitle className="text-lg font-semibold text-left">{post.title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-base text-slate-800 text-left">{post.content}</p>
      <img
        src={post.image}
        alt={post.title}
        className={`w-full h-48 object-cover rounded mb-1 ${isStaff ? "" : "filter blur-sm brightness-75"}`}
      />
      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={() => onLike(post.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "#ef4444" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 text-red-600 transition-all"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 C2 5.42 4.42 3 7.5 3
                 c1.74 0 3.41.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3
                 C19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54
                 L12 21.35z"
            />
          </svg>
          Like ({post.likes})
        </Button>
      </div>
      <CommentList comments={post.comments} userRole={post.authorRole || "Staff"} />
      <CommentInput onAddComment={(comment) => onAddComment(post.id, comment)} />
    </CardContent>
  </Card>
);

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<Post, "id" | "likes" | "comments" | "time">) => void;
  initialPost?: Post;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPost,
}) => {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [tags, setTags] = useState(initialPost?.tags.join(", ") || "");
  const [image, setImage] = useState(initialPost?.image || "");

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        image,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        authorName: "Staff Member",
        authorRole: "Staff",
        residentName: "Nguyen Thi Thoa",
        room: "Room 203",
        canEdit: true,
      });
      setTitle("");
      setContent("");
      setTags("");
      setImage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialPost ? "Edit Post" : "Create New Post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [filter, setFilter] = useState<string>("Day");
  const [search, setSearch] = useState<string>("");
  const [userRole] = useState<UserRole>("Staff"); // Set to Staff for this context
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  const isStaff = userRole === "Staff";

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: likedPosts.includes(id) ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleAddComment = (id: number, comment: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const handleSavePost = (newPostData: Omit<Post, "id" | "likes" | "comments" | "time">) => {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? { ...post, ...newPostData }
            : post
        )
      );
    } else {
      const newPost: Post = {
        ...newPostData,
        id: Math.max(...posts.map((p) => p.id)) + 1,
        likes: 0,
        comments: [],
        time: new Date().toLocaleString(),
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-[1200px] bg-white overflow-x-hidden rounded-xl -mt-13 -ml-5">
      <div className="flex-1 flex overflow-x-hidden mx-auto rounded-lg">
        <SidebarFilters
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          userRole={userRole}
          onCreatePost={handleCreatePost}
        />
        <ResidentInfoCard residentName="Nguyen Thi Thoa" room="Room 301" />
        <main className="flex-1 w-[800px] p-6 overflow-y-auto border border-gray-300 rounded-lg">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isStaff={isStaff}
              onLike={handleLike}
              onAddComment={handleAddComment}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              liked={likedPosts.includes(post.id)}
            />
          ))}
          <Button
            className="w-full mt-2 h-9 text-sm"
            style={{ backgroundColor: "#5985d8" }}
          >
            Load More
          </Button>
        </main>
      </div>
      <footer className="flex-shrink-0 bg-[#5985d8] text-white text-center py-4 text-xs">
        <p>
          © 2025 HeLiCare. Protecting the health of the elderly.{" "}
          <span className="mx-1">|</span>
          <a href="#" className="underline">
            Contact Us
          </a>
        </p>
      </footer>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSavePost}
        initialPost={editingPost}
      />
    </div>
  );
};

export default App;
