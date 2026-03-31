export const mockUser = {
  id: "u1",
  name: "Jamshid Nurillayev",
  email: "nurillayevjamshid877@gmail.com",
  photoURL: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  role: "SMM Manager",
};

export const mockStats = {
  totalProjects: 12,
  scheduledPosts: 48,
  publishedPosts: 1240,
  failedPosts: 3,
};

export const mockProjects = [
  {
    id: "p1",
    name: "Tech Startup Inc.",
    description: "B2B SaaS product marketing and updates.",
    brandColor: "bg-blue-500",
    platforms: ["instagram", "telegram"],
    postCount: 142,
    createdAt: new Date("2023-10-12").getTime(),
  },
  {
    id: "p2",
    name: "Coffee Shop 'Beans'",
    description: "Daily specials, aesthetic photos, and community events.",
    brandColor: "bg-amber-600",
    platforms: ["instagram"],
    postCount: 89,
    createdAt: new Date("2024-01-05").getTime(),
  },
  {
    id: "p3",
    name: "Crypto News Channel",
    description: "Fast-paced daily crypto updates and market analysis.",
    brandColor: "bg-emerald-500",
    platforms: ["telegram"],
    postCount: 450,
    createdAt: new Date("2023-11-20").getTime(),
  },
  {
    id: "p4",
    name: "Personal Brand",
    description: "My personal thoughts, design tips, and lifestyle.",
    brandColor: "bg-purple-500",
    platforms: ["instagram", "telegram"],
    postCount: 34,
    createdAt: new Date("2024-02-15").getTime(),
  },
];

export const mockRecentActivity = [
  {
    id: "a1",
    project: "Tech Startup Inc.",
    action: "Published a post",
    platform: "telegram",
    time: "10 mins ago",
    status: "success",
  },
  {
    id: "a2",
    project: "Coffee Shop 'Beans'",
    action: "Scheduled a post for tomorrow",
    platform: "instagram",
    time: "2 hours ago",
    status: "scheduled",
  },
  {
    id: "a3",
    project: "Crypto News Channel",
    action: "Failed to publish (API Error)",
    platform: "telegram",
    time: "5 hours ago",
    status: "failed",
  },
  {
    id: "a4",
    project: "Personal Brand",
    action: "Uploaded 3 new media files",
    platform: "system",
    time: "1 day ago",
    status: "success",
  },
];

export const mockPosts = [
  {
    id: "post1",
    projectId: "p1",
    title: "Launch Announcement",
    content: "We are excited to announce the launch of our new product!",
    status: "Published",
    scheduledAt: "2024-03-20 10:00",
    media: ["https://picsum.photos/800/600?random=11"],
    platforms: ["instagram", "telegram"],
  },
  {
    id: "post2",
    projectId: "p1",
    title: "Feature Spotlight",
    content: "Check out this amazing new feature we just added.",
    status: "Scheduled",
    scheduledAt: "2024-03-25 15:00",
    media: ["https://picsum.photos/800/600?random=12"],
    platforms: ["instagram"],
  }
];
