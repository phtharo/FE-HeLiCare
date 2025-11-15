//những logic đã thêm : userlogin(xác định role), fetch list post(/lib),filter,render feed, like, comment, create post, edit post, delete post, report post
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
import { useNavigate, useLocation } from "react-router-dom";
import ResidentSelector from "../components/ui/ResidentSelector";

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
  residentIds: number[]; // IDs of residents associated with the post
  visibility: "STAFF_ONLY" | "STAFF_AND_FAMILY_OF_RESIDENTS" | "PUBLIC"; // Visibility rules
}

// Sample data
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
    residentIds: [1, 2],
    visibility: "PUBLIC",
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
    residentIds: [2],
    visibility: "STAFF_AND_FAMILY_OF_RESIDENTS",
  },
];

const App: React.FC = () => {
  const initialPosts = (): Post[] => {
    try {
      const raw = localStorage.getItem("newsfeedPosts");
      if (raw) return JSON.parse(raw) as Post[];
    } catch (e) {
      console.error("Failed to parse saved posts:", e);
    }
    return samplePosts;
  };

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<string>("Day");
  const [search, setSearch] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("Family");

  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;

    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [selectedResidentIds, setSelectedResidentIds] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Receive new post from create-post page (via navigate state) and persist to localStorage
  React.useEffect(() => {
    const state = location.state as { newPost?: Post } | null;
    if (state?.newPost) {
      const newPost = state.newPost;
      setPosts((prev) => {
        if (prev.some((p) => p.id === newPost.id)) return prev;
        const updated = [newPost!, ...prev];
        try {
          localStorage.setItem("newsfeedPosts", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save posts:", e);
        }
        return updated;
      });
      // clear state to avoid duplicate on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const syncLocalStorage = (updatedPosts: Post[]) => {
    try {
      localStorage.setItem("newsfeedPosts", JSON.stringify(updatedPosts));
    } catch (e) {
      console.error("Failed to sync posts to localStorage:", e);
    }
  };

  const fetchPosts = async (): Promise<Post[]> => {
    try {
      const response = await fetch("https://api.example.com/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const savePost = async (post: Post) => {
    try {
      const response = await fetch("https://api.example.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const updatePost = async (post: Post) => {
    try {
      const response = await fetch(`https://api.example.com/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`https://api.example.com/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const likePost = async (id: number) => {
    try {
      const response = await fetch(`https://api.example.com/posts/${id}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const commentOnPost = async (id: number, comment: string) => {
    try {
      const response = await fetch(`https://api.example.com/posts/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });
      if (!response.ok) {
        throw new Error("Failed to comment on post");
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  React.useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
    loadPosts();
  }, []);

  const handleLike = async (id: number) => {
    await likePost(id);
    setPosts((prev) => {
      const updatedPosts = prev.map((post) =>
        post.id === id
          ? {
            ...post,
            likes: likedPosts.includes(id) ? post.likes - 1 : post.likes + 1,
          }
          : post
      );
      syncLocalStorage(updatedPosts);
      return updatedPosts;
    });
    setLikedPosts((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  const handleComment = async (id: number, comment: string) => {
    await commentOnPost(id, comment);
    setPosts((prev) => {
      const updatedPosts = prev.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      );
      syncLocalStorage(updatedPosts);
      return updatedPosts;
    });
  };

  const handleEdit = (id: number) => {
    const post = posts.find((p) => p.id === id);
    // pass the post in navigation state as a fallback source
    navigate(`/create-post/${id}`, { state: { post } });
  };

  const handleDelete = async (id: number) => {
    await deletePost(id);
    setPosts((prev) => {
      const updatedPosts = prev.filter((post) => post.id !== id);
      syncLocalStorage(updatedPosts);
      return updatedPosts;
    });
    setShowMenu(null);
  };

  const handleReport = async (id: number) => {
    try {
      const response = await fetch("https://api.example.com/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to report post");
      }

      console.log("Post reported successfully");
    } catch (error) {
      console.error("Error reporting post:", error);
    }

    setShowMenu(null);
  };

  React.useEffect(() => {
    const state = location.state as { newPost?: Post; updatedPostId?: number } | null;

    if (state?.newPost) {
      const newPost = state.newPost;
      setPosts((prev) => {
        if (prev.some((p) => p.id === newPost.id)) return prev;
        const updated = [newPost, ...prev];
        syncLocalStorage(updated);
        return updated;
      });
    }

    if (state?.updatedPostId) {
      const updated = JSON.parse(localStorage.getItem("newsfeedPosts") || "[]");
      setPosts(updated);
    }

    if (state) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const filterPostsByTime = (posts: Post[], filter: string): Post[] => {
    const now = new Date();
    return posts.filter((post) => {
      const postDate = new Date(post.time);
      switch (filter) {
        case "Day":
          return now.toDateString() === postDate.toDateString();
        case "Week": {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return postDate >= oneWeekAgo && postDate <= now;
        }
        case "Month": {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return postDate >= oneMonthAgo && postDate <= now;
        }
        default:
          return true;
      }
    });
  };

  const filteredPosts = filterPostsByTime(
    posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    ),
    filter
  );

  const visiblePosts = filteredPosts.filter((post) => {
    if (userRole === "Staff") return true;
    if (userRole === "Family")
      return (
        post.visibility !== "STAFF_ONLY" &&
        post.residentIds.some((id) => selectedResidentIds.includes(String(id)))
      );
    if (userRole === "Resident")
      return post.residentIds.some((id) => selectedResidentIds.includes(String(id)));
    return post.visibility === "PUBLIC";
  });

  return (
    <div className="flex-1 flex flex-col w-[1100px] overflow-x-hidden rounded-2xl ">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>
      {/* Main Area */}
      <div className="flex-1 flex overflow-x-hidden bg-white mx-auto rounded-xl">
        {/* Sidebar */}
        <aside className="flex-shrink-0 w-72 bg-white p-4 border overflow-y-auto min-h-screen">
          <h2 className="text-lg font-semibold mb-4">Toolbar</h2>
          <h3 className="text-sm font-medium text-left mb-4">Filters</h3>

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="mt-4 w-full h-9 text-sm"
          />

          <div className="mt-4">
            <h3 className="text-sm font-medium text-left mb-2">Filter by Resident</h3>
            <ResidentSelector
              selectedResidentIds={selectedResidentIds}
              onChange={(ids) => setSelectedResidentIds(ids)}
            />
          </div>

          {(userRole === "Staff" || userRole === "Resident") && (
            <Button
              className="mt-4 w-full h-9 text-sm"
              style={{ backgroundColor: "#5985d8" }}
              onClick={() => navigate("/create-post")}
            >
              Create New Post
            </Button>
          )}

          {/* Resident Information Display */}
          <div className="mt-6 space-y-4 bg-white border border-gray-300 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
              <Avatar>
                <AvatarImage src="https://via.placeholder.com/100" alt="Resident" />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-lg font-semibold text-gray-800">Nguyen Thi Thoa</p>
            <p className="text-sm text-gray-600">Room 301</p>
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-[800px] p-6 overflow-y-auto border border-gray-300 rounded-lg">
          {visiblePosts.map((post) => (
            <Card key={post.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/40" alt="Resident" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Nguyen Thi Thoa</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {(userRole === "Staff" || userRole === "Resident") && (
                    <div className="ml-auto relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setShowMenu((prev) => (prev === post.id ? null : post.id))}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </Button>
                      {showMenu === post.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEdit(post.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleReport(post.id)}
                          >
                            Report
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-left">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-slate-800 text-left">{post.content}</p>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded mb-1 filter blur-sm brightness-75"
                />

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center gap-1"
                    onClick={() => handleLike(post.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={likedPosts.includes(post.id) ? "#ef4444" : "none"}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleComment(post.id, "New comment")}
                  >
                    Comment ({post.comments.length})
                  </Button>
                </div>

                <div className="mt-2 space-y-1">
                  {post.comments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2"
                    >
                      <Avatar>
                        <AvatarImage src="https://via.placeholder.com/40" alt="Commenter" />
                        <AvatarFallback>{userRole[0]}</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-1 text-xs text-gray-600 leading-snug text-left max-w-xs">
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {userRole}
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {userRole}
                          </Badge>
                        </div>
                        <p>{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Section */}
                <div className="mt-4">
                  <Input
                    placeholder="Write a comment..."
                    className="w-full h-9 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                        handleComment(post.id, e.currentTarget.value);
                        e.currentTarget.value = ""; // Clear the input field
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full mt-2 h-9 text-sm"
            style={{ backgroundColor: "#5985d8" }}
          >
            Load More
          </Button>
        </main>
      </div>

      {/* Footer */}
      {/* <footer className="flex-shrink-0 bg-[#5985d8] text-white text-center py-4 text-xs">
        <p>
          © 2025 HeLiCare. Protecting the health of the elderly. {" "}
          <span className="mx-1">|</span>
          <a href="#" className="underline">
            Contact Us
          </a>
        </p>
      </footer> */}
    </div>
  );
};

export default App;
