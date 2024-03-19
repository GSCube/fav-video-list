export interface YoutubeVideo {
  id: string;
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}
