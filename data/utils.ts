const youtubeVideoIdPattern =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;

export const getYoutubeVideoId = (url: string) => {
  const match = url.match(youtubeVideoIdPattern);
  return match ? match[1] : url;
};
