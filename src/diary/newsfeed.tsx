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
  },
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [filter, setFilter] = useState<string>("Day");
  const [search, setSearch] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("Family");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

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
      prev.includes(id)
        ? prev.filter((pid) => pid !== id) 
        : [...prev, id] 
    );
  };

  const handleComment = (id: number, comment: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-[1550px] flex flex-col bg-gray-50 overflow-x-hidden -mt-8 -ml-10">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#5985d8] text-white py-4 flex justify-between items-center shadow-md px-4 md:px-8 w-full">
        <div className="text-2xl font-bold">HeLiCare</div>

        <nav className="flex gap-4 text-sm">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Personal Diary
          </a>
          <a href="#" className="hover:underline">
            Group Activities
          </a>
          <a href="#" className="hover:underline">
            Notifications
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://via.placeholder.com/40" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            className="border-white text-gray-800 hover:bg-white/10 h-9 px-3 text-xs"
          >
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden w-[1300px]">
        {/* Sidebar */}
        <aside className="flex-shrink-0 w-72 bg-white p-4 border-r overflow-y-auto min-h-screen">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="mt-4 w-full h-9 text-sm"
          />

          {(userRole === "Staff" || userRole === "Admin") && (
            <Button
              className="mt-4 w-full h-9 text-sm"
              style={{ backgroundColor: "#5985d8" }}
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
        <main className="flex-1 p-6 overflow-y-auto bg-white border border-gray-300 rounded-lg">
          {filteredPosts.map((post) => (
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
      <footer className="flex-shrink-0 bg-[#5985d8] text-white text-center py-4 text-xs">
        <p>
          © 2025 HeLiCare. Protecting the health of the elderly. {" "}
          <span className="mx-1">|</span>
          <a href="#" className="underline">
            Contact Us
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
