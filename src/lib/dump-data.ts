export const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Welcome to our platform",
    message: "Get started with our comprehensive guides and documentation.",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    actionUrl: "/docs",
  },
  {
    id: 2,
    title: "New message from Sarah",
    message: "Hey! How are you doing? Would love to catch up soon.",
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    actionUrl: "/messages",
  },
  {
    id: 3,
    title: "System update available",
    message: "A new version is ready to download with improved performance.",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 4,
    title: "Payment received",
    message: "Your payment of $99.99 has been processed successfully.",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 5,
    title: "Security alert",
    message: "New login detected from Chrome on macOS.",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];
