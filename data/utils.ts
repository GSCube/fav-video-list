export const youtubeParser = (url: string) => {
  console.log('url', url)
  const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  // let regex = /https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9]+/i;
  const match = url.match(pattern);
  console.log(match)
  return match ? match[1] : url;
}
