import { FavVideosWithViewsResponse, Video } from '@/data/types';

export const formatToTableData = (video: FavVideosWithViewsResponse): Video => {
  return {
    playlistElementId: video.id,
    videoId: video.snippet.resourceId.videoId,
    title: video.snippet.title,
    viewCount: video.views,
    dateAdded: video.snippet.publishedAt,
    thumbnail: video.snippet.thumbnails.default.url,
  };
};
