export default class SelfLearningEngine {
  constructor() {
    this.learningRate = 0.1;
    this.memoryBuffer = [];
    this.maxBufferSize = 100;
    this.customPatterns = {};
    this.loadLearnedPatterns();
  }

  analyzeConversationOutcome(conversation) {
    if (conversation.length < 2) return { success: false, score: 0 };
    
    const lastUserMessage = conversation[conversation.length - 2]?.text || '';
    const botResponse = conversation[conversation.length - 1]?.text || '';
    
    // Simple sentiment analysis
    const positiveWords = ['thanks', 'helpful', 'better', 'good', 'calm', 'useful'];
    const negativeWords = ['bad', 'worse', 'useless', 'not helpful', 'wrong'];
    
    const positiveScore = positiveWords.filter(word => 
      lastUserMessage.toLowerCase().includes(word)).length;
    const negativeScore = negativeWords.filter(word => 
      lastUserMessage.toLowerCase().includes(word)).length;

    return {
      success: positiveScore > negativeScore,
      score: positiveScore - negativeScore
    };
  }

  updateResponseModels(conversationHistory, responseGenerator) {
    const outcome = this.analyzeConversationOutcome(conversationHistory);
    
    if (conversationHistory.length >= 3) {
      const lastBotResponse = conversationHistory[conversationHistory.length - 1].text;
      const emotionBeforeResponse = conversationHistory[conversationHistory.length - 3].emotion;
      
      if (lastBotResponse && emotionBeforeResponse) {
        responseGenerator.updateResponseEffectiveness(
          lastBotResponse,
          emotionBeforeResponse,
          outcome.success
        );
      }
    }
  }

  checkForNewModules(conversationHistory) {
    const frequentTopics = this.identifyFrequentTopics(conversationHistory);
    const newPatterns = this.identifyNewPatterns(conversationHistory);
    
    // Add new patterns to emotion analyzer
    newPatterns.forEach(({emotion, pattern}) => {
      if (!this.customPatterns[emotion]) {
        this.customPatterns[emotion] = [];
      }
      
      if (!this.customPatterns[emotion].includes(pattern)) {
        this.customPatterns[emotion].push(pattern);
      }
    });
    
    this.saveLearnedPatterns();
  }

  identifyFrequentTopics(conversations) {
    const wordCounts = {};
    conversations.forEach(conv => {
      if (conv.sender === 'user') {
        conv.text.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 3) { // Ignore short words
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(wordCounts)
      .filter(([_, count]) => count > 3) // Threshold for "frequent"
      .map(([word]) => word);
  }

  identifyNewPatterns(conversations) {
    const patterns = [];
    const emotionMessages = conversations.filter(m => m.emotion && m.sender === 'user');
    
    // Group messages by emotion
    const messagesByEmotion = {};
    emotionMessages.forEach(msg => {
      if (!messagesByEmotion[msg.emotion]) {
        messagesByEmotion[msg.emotion] = [];
      }
      messagesByEmotion[msg.emotion].push(msg.text.toLowerCase());
    });
    
    // Find common phrases for each emotion
    for (const [emotion, messages] of Object.entries(messagesByEmotion)) {
      if (messages.length >= 3) { // Need multiple examples
        const words = messages.join(' ').split(/\s+/);
        const wordPairs = [];
        
        // Create word pairs
        for (let i = 0; i < words.length - 1; i++) {
          wordPairs.push(`${words[i]} ${words[i+1]}`);
        }
        
        // Count occurrences
        const pairCounts = {};
        wordPairs.forEach(pair => {
          pairCounts[pair] = (pairCounts[pair] || 0) + 1;
        });
        
        // Add patterns that appear multiple times
        for (const [pair, count] of Object.entries(pairCounts)) {
          if (count >= 3 && !this.customPatterns[emotion]?.includes(pair)) {
            patterns.push({ emotion, pattern: pair });
          }
        }
      }
    }
    
    return patterns;
  }

  saveLearnedPatterns() {
    localStorage.setItem('learnedPatterns', JSON.stringify(this.customPatterns));
  }

  loadLearnedPatterns() {
    const savedPatterns = localStorage.getItem('learnedPatterns');
    if (savedPatterns) {
      try {
        this.customPatterns = JSON.parse(savedPatterns);
      } catch (e) {
        console.error('Failed to load learned patterns:', e);
      }
    }
  }
}