
type typeResult = 'VIDEO' | 'EMBED'

export interface getVideoEmbedUrlResult {
    type: typeResult,
    url: string
}

const defaultResult: {type: typeResult} = {
    type: 'EMBED'
}

export const getVideoEmbedUrl = (videoUrl: string): getVideoEmbedUrlResult | null => {
  const patterns = {
    youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    vimeo: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
    dailymotion: /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/,
    wistia: /(?:https?:\/\/)?(?:www\.)?(?:wistia\.com|wi\.st)\/(?:medias|embed\/iframe)\/([a-zA-Z0-9]+)/,
    vidyard: /(?:https?:\/\/)?(?:www\.)?(?:play\.vidyard\.com|vidyard\.com)\/([a-zA-Z0-9_-]+)/,
    rumble: /(?:https?:\/\/)?(?:www\.)?rumble\.com\/(?:v|embed\/)([a-zA-Z0-9_-]+)/,
    videoFile: /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|ts)$/i
  };

  if (patterns.videoFile.test(videoUrl)) {
    return {
        url: videoUrl,
        type: 'VIDEO'
    };
  }

  if (patterns.youtube.test(videoUrl)) {
    const match = videoUrl.match(patterns.youtube);
    if (match && match[1]) {
      return {...defaultResult, url: `https://www.youtube.com/embed/${match[1]}`};
    }
  } else if (patterns.vimeo.test(videoUrl)) {
    const match = videoUrl.match(patterns.vimeo);
    if (match && match[1]) {
      return {...defaultResult, url: `https://player.vimeo.com/video/${match[1]}`};
    }
  } else if (patterns.dailymotion.test(videoUrl)) {
    const match = videoUrl.match(patterns.dailymotion);
    if (match && match[1]) {
      return {...defaultResult, url: `https://www.dailymotion.com/embed/video/${match[1]}`};
    }
  } else if (patterns.wistia.test(videoUrl)) {
    const match = videoUrl.match(patterns.wistia);
    if (match && match[1]) {
      return {...defaultResult, url: `https://fast.wistia.net/embed/iframe/${match[1]}`};
    }
  } else if (patterns.vidyard.test(videoUrl)) {
    const match = videoUrl.match(patterns.vidyard);
    if (match && match[1]) {
      return {...defaultResult, url: `https://play.vidyard.com/${match[1]}`};
    }
  } else if (patterns.rumble.test(videoUrl)) {
    const match = videoUrl.match(patterns.rumble);
    if (match && match[1]) {
      return {...defaultResult, url: `https://rumble.com/embed/${match[1]}`};
    }
  }

  return null;
}

// Примеры:
// console.log(getVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")); 
// Output: https://www.youtube.com/embed/dQw4w9WgXcQ
// console.log(getVideoEmbedUrl("https://vimeo.com/123456789")); 
// Output: https://player.vimeo.com/video/123456789
// console.log(getVideoEmbedUrl("https://example.com/video.mp4")); 
// Output: https://example.com/video.mp4