export default class EmotionAnalyzer {
  constructor() {
    this.emotionKeywords = {
      'depression': ['sad', 'hopeless', 'empty', 'numb', 'worthless', 'alone', 'depressed'],
      'anxiety': ['worry', 'nervous', 'panic', 'overwhelmed', 'scared', 'fear', 'anxious'],
      'anger': ['mad', 'furious', 'annoyed', 'rage', 'angry', 'hate', 'frustrated'],
      'suicidal': ['kill myself', 'end it all', 'want to die', 'suicide', 'not want to live'],
      'happy': ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'content'],
      'stress': ['stressed', 'pressure', 'burnout', 'exhausted', 'too much'],
      'neutral': ['okay', 'fine', 'alright', 'meh', 'whatever']
    };
    
    this.customPatterns = {}; // Will be populated through learning
  }

  analyze(text) {
    const detectedEmotions = [];
    const lowerText = text.toLowerCase();
    
    // Check custom patterns first (learned responses)
    for (const [emotion, patterns] of Object.entries(this.customPatterns)) {
      if (patterns.some(pattern => {
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
          // Regex pattern
          try {
            const regex = new RegExp(pattern.slice(1, -1), 'i');
            return regex.test(text);
          } catch {
            return false;
          }
        }
        // String pattern
        return lowerText.includes(pattern);
      })) {
        detectedEmotions.push(emotion);
      }
    }
    
    // Check built-in keywords if no custom patterns matched
    if (detectedEmotions.length === 0) {
      for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
          detectedEmotions.push(emotion);
        }
      }
    }
    
    return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
  }

  addCustomPattern(emotion, pattern) {
    if (!this.customPatterns[emotion]) {
      this.customPatterns[emotion] = [];
    }
    
    if (!this.customPatterns[emotion].includes(pattern)) {
      this.customPatterns[emotion].push(pattern);
    }
  }
}