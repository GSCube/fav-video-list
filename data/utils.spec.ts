import { youtubeParser } from './utils';

describe('youtubeParser', () => {
  it('should parse youtube url', () => {
    const url = 'https://www.youtube.com/watch?v=9bZkp7q19f0';
    const result = youtubeParser(url);
    expect(result).toBe('9bZkp7q19f0');
  });
  it('should return the same string if the url is not a youtube url', () => {
    const url = 'https://www.google.com';
    const result = youtubeParser(url);
    expect(result).toBe(url);
  });
});
