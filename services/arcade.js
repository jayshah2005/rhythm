import Arcade from "@arcadeai/arcadejs";
import { ENV } from '../config/env';

class ArcadeYouTubeService {
  constructor() {
    this.apiKey = ENV.ARCADE_API_KEY;
    this.client = new Arcade({
      apiKey: this.apiKey,
    });
    this.userId = "jayshah3616@gmail.com"; // You can make this dynamic
  }

  // Search for a single video based on keywords using Arcade.dev
  async searchVideo(keywords, maxResults = 1) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Arcade.dev API key not configured');
      }

      // Use Arcade.dev's YouTube SearchForVideos tool
      const response = await this.client.tools.execute({
        tool_name: "Youtube.SearchForVideos",
        input: {
          keywords: keywords,
          language_code: "en",
          country_code: "US",
          next_page_token: ""
        },
        user_id: this.userId,
      });

      if (!response || !response.output || !response.output.value || !response.output.value.videos) {
        return {
          success: false,
          message: 'No videos found for the given keywords',
          video: null
        };
      }

      const videos = response.output.value.videos;
      if (videos.length === 0) {
        return {
          success: false,
          message: 'No videos found for the given keywords',
          video: null
        };
      }

      // Get the first video
      const video = videos[0];
      const videoData = {
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
        channelTitle: video.channel?.name || video.channel,
        publishedAt: video.published_date,
        url: video.link || `https://www.youtube.com/watch?v=${video.id}`,
        duration: video.duration,
        viewCount: video.view_count,
        likeCount: video.like_count
      };

      return {
        success: true,
        message: 'Video found successfully',
        video: videoData
      };

    } catch (error) {
      console.error('Error searching YouTube via Arcade.dev:', error);
      return {
        success: false,
        message: error.message,
        video: null
      };
    }
  }

  // Get video details by video ID using Arcade.dev
  async getVideoDetails(videoId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Arcade.dev API key not configured');
      }

      // Use Arcade.dev's YouTube GetVideoDetails tool if available
      // For now, we'll use the search functionality as a fallback
      const response = await this.client.tools.execute({
        tool_name: "Youtube.SearchForVideos",
        input: {
          keywords: videoId,
          language_code: "en",
          country_code: "US",
          next_page_token: ""
        },
        user_id: this.userId,
      });

      if (!response || !response.output || !response.output.value || !response.output.value.videos) {
        return {
          success: false,
          message: 'Video not found',
          video: null
        };
      }

      const videos = response.output.value.videos;
      const video = videos.find(v => v.id === videoId);
      
      if (!video) {
        return {
          success: false,
          message: 'Video not found',
          video: null
        };
      }

      const videoData = {
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
        channelTitle: video.channel?.name || video.channel,
        publishedAt: video.published_date,
        duration: video.duration,
        viewCount: video.view_count,
        likeCount: video.like_count,
        url: video.link || `https://www.youtube.com/watch?v=${video.id}`
      };

      return {
        success: true,
        message: 'Video details retrieved successfully',
        video: videoData
      };

    } catch (error) {
      console.error('Error getting video details via Arcade.dev:', error);
      return {
        success: false,
        message: error.message,
        video: null
      };
    }
  }

  // Check if API key is configured
  isConfigured() {
    return this.apiKey && this.apiKey !== 'your_arcade_api_key_here';
  }

  // Get a random video for break time based on mood
  async getBreakVideo(mood, workedFor) {
    const moodKeywords = {
      'tired': 'relaxing music meditation calm',
      'stressed': 'stress relief breathing exercises mindfulness',
      'good': 'motivational music upbeat energy',
      'keep_going': 'productivity tips focus music'
    };

    const keywords = moodKeywords[mood] || 'break time relaxation';
    return await this.searchVideo(keywords);
  }

  // Get multiple videos for a search (useful for playlists)
  async searchVideos(keywords, maxResults = 5) {
    try {
      if (!this.isConfigured()) {
        throw new Error('Arcade.dev API key not configured');
      }

      const response = await this.client.tools.execute({
        tool_name: "Youtube.SearchForVideos",
        input: {
          keywords: keywords,
          language_code: "en",
          country_code: "US",
          next_page_token: ""
        },
        user_id: this.userId,
      });

      if (!response || !response.output || !response.output.value || !response.output.value.videos) {
        return {
          success: false,
          message: 'No videos found for the given keywords',
          videos: []
        };
      }

      const videos = response.output.value.videos.slice(0, maxResults).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
        channelTitle: video.channel?.name || video.channel,
        publishedAt: video.published_date,
        url: video.link || `https://www.youtube.com/watch?v=${video.id}`,
        duration: video.duration,
        viewCount: video.view_count,
        likeCount: video.like_count
      }));

      return {
        success: true,
        message: `${videos.length} videos found successfully`,
        videos: videos
      };

    } catch (error) {
      console.error('Error searching videos via Arcade.dev:', error);
      return {
        success: false,
        message: error.message,
        videos: []
      };
    }
  }
}

export default new ArcadeYouTubeService();