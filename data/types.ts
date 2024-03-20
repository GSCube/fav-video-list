export interface YoutubeVideo {
  id: string;
  views: number;
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
