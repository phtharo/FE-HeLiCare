// TypeScript definitions
export type Role = "Staff" | "Resident" | "Family" | "Admin";

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  tags: string[];
  time: string;
  likes: number;
  comments: string[];
  residentIds: string[]; // many residents (group activity)
  visibility: "STAFF_ONLY" | "STAFF_AND_FAMILY_OF_RESIDENTS";
  facilityId: string;
}

export interface StaffUser {
  role: "Staff";
  staffId: string;
  facilityId: string;
}

export interface ResidentUser {
  role: "Resident";
  residentId: string;
  facilityId: string;
}

export interface FamilyUser {
  role: "Family";
  familyId: string;
  residentIds: string[]; // list resident mà family are linked
  facilityId: string;
}

export interface AdminUser {
  role: "Admin";
  facilityId: string;
}

export type AnyUser = StaffUser | ResidentUser | FamilyUser | AdminUser;

// Core function to check if a user can see a post
export function canUserSeePost(user: AnyUser, post: Post): boolean {
  
  if (user.facilityId !== post.facilityId) return false;

  switch (user.role) {
    case "Admin":
      // Admin see all
      return true;

    case "Staff":
      // Staff see all posts in facility (can be restricted by area if needed)
      return true;

    case "Resident":
      // Resident only sees posts with their residentId
      if (post.visibility === "STAFF_ONLY") return false;
      return post.residentIds.includes(user.residentId);

    case "Family":
      // Family only sees posts with overlapping residentIds
      if (post.visibility === "STAFF_ONLY") return false;
      return post.residentIds.some((rid) => user.residentIds.includes(rid));

    default:
      return false;
  }
}

// Function to update feed with a new post
export function updateFeedWithNewPost(
  prevFeed: Post[],
  newPost: Post,
  user: AnyUser
): Post[] {
  // only add in feed if user can see the post
  if (!canUserSeePost(user, newPost)) {
    return prevFeed;
  }

  // If user has permission, prepend newPost
  
  const exists = prevFeed.some((p) => p.id === newPost.id);
  if (exists) return prevFeed;

  return [newPost, ...prevFeed];
}