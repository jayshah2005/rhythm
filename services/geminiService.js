import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';

class GeminiService {
  constructor() {
    this.apiKey = ENV.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Generate break activity suggestion
  async generateBreakActivity(workedFor, breakTime, mood) {
    try {
      const prompt = `
You are a friendly productivity assistant. Suggest **exactly one** short, fun, and relaxing break activity for someone who has been working for ${workedFor} minutes, taking a ${breakTime}-minute break, and currently feels ${mood}. 

The activity should:
- Be Refreshing
- Be equipment-free
- Something a person anywhere can do
- Take less than 10 minutes
- Be something anyone can do
- Use the style of these examples: Go for a walk, Drink Water, Take a power nap, Stretch, Meditate, Eat a snack
- Not be too draining

Only return **one activity**, in one sentence without any other context.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating break activity:', error);
      // Fallback suggestions based on mood
      return this.getFallbackActivity(mood);
    }
  }

  // Fallback activity suggestions when API fails
  getFallbackActivity(mood) {
    const activities = {
      'tired': 'Take a power nap for 5-10 minutes',
      'good': 'Go for a short walk around the room',
      'stressed': 'Take 5 deep breaths and stretch your shoulders',
    };
    
    return activities[mood] || 'Take a few deep breaths and stretch your arms';
  }

  // Check if API key is configured
  isConfigured() {
    return this.apiKey && this.apiKey !== 'your_api_key_here';
  }
}

export default new GeminiService();
