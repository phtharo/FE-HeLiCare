import type { Post, AnyUser } from "./postUtils";
import { canUserSeePost } from "./postUtils";

// Fetch posts from the API based on user role
export async function fetchPosts(user: AnyUser): Promise<Post[]> {
  let url = "/api/posts";

  // Add query parameters based on user role
  switch (user.role) {
    case "Staff":
      url += `?facilityId=${user.facilityId}`;
      break;
    case "Resident":
      url += `?residentId=${user.residentId}`;
      break;
    case "Family":
      url += `?familyId=${user.familyId}`;
      break;
    case "Admin":
      url += `?facilityId=${user.facilityId}&scope=all`;
      break;
    default:
      throw new Error("Unsupported user role");
  }

  // Fetch posts from the API
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await response.json();

  // Filter posts based on visibility
  return posts.filter((post) => canUserSeePost(user, post));
}

// Save posts to localStorage
export function savePostsToCache(posts: Post[]): void {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Load posts from localStorage
export function loadPostsFromCache(): Post[] {
  const cachedPosts = localStorage.getItem("posts");
  return cachedPosts ? JSON.parse(cachedPosts) : [];
}

// Update feed with a new post
export function updateFeedWithNewPost(
  prevFeed: Post[],
  newPost: Post,
  user: AnyUser
): Post[] {
  return canUserSeePost(user, newPost) ? [newPost, ...prevFeed] : prevFeed;
}