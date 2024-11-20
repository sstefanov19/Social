interface Post {
    id: string;
    title: string;
    description: string;
    likes: number;
    imageUrl: string;
    likedByUser: boolean;
  }

  export async function handleLike(
    postId: string,
    userId: string,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLikedPosts: React.Dispatch<React.SetStateAction<Set<`${string}-${string}`>>>,
  ) {
    try {
      const response = await fetch("/api/likes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to like/unlike post");

      const { likedByUser, updatedLikes } = (await response.json()) as {
        likedByUser: boolean;
        updatedLikes: number;
      };

      const postKey = `${userId}-${postId}` as const;

      setLikedPosts((prevLikedPosts) => {
        const updated = new Set(prevLikedPosts);
        if (likedByUser) {
          updated.add(postKey);
        } else {
          updated.delete(postKey);
        }
        return updated;
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (err) {
      console.error("Error occurred while liking/unliking post:", err);
    }
  }
