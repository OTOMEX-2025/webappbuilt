export default class ResponseGenerator {
  constructor() {
    this.baseResponses = this.getBaseResponses();
    this.successfulResponses = {};
    this.avoidPhrases = {};
    this.responseWeights = {};
    this.responseEffectiveness = {};
    
    if (typeof window !== 'undefined') {
      this.loadLearnedData();
    }
  }

  getBaseResponses() {
    return {
      emergency: [
        "I'm really concerned about what you're sharing. Your life is precious. Please call the National Suicide Prevention Lifeline at 1-800-273-8255 right now.",
        "I hear that you're in tremendous pain. You're not alone. Please reach out to a crisis hotline immediately. In the US, you can call 988 for help."
      ],
      depression: [
        "I'm sorry you're feeling this way. Would you like to talk more about what's been on your mind?",
        "That sounds really difficult. Remember that feelings are temporary, even when they don't feel that way.",
        "I'm here with you. Would it help to do a grounding exercise together?"
      ],
      anxiety: [
        "I hear that you're feeling anxious. Let's take a moment to breathe together.",
        "Anxiety can feel overwhelming. Try naming five things you can see around you—it might help ground you in the present.",
        "Would it help to break down what's worrying you into smaller pieces?"
      ],
      anger: [
        "It sounds like you're feeling really frustrated. Want to talk about what's bothering you?",
        "Anger is a valid emotion. Sometimes writing down what we're feeling can help process it.",
        "I'm here to listen if you want to share what's making you feel this way."
      ],
      happy: [
        "It's wonderful to hear you're feeling good! Would you like to share what's bringing you joy?",
        "I'm glad you're having a positive day! Savoring good moments can help build resilience.",
        "That's great! Celebrating the good times is just as important as working through the hard ones."
      ],
      stress: [
        "Stress can really weigh on us. Would it help to prioritize what's most important right now?",
        "When I'm stressed, I find it helps to focus on one thing at a time. Would that approach help you?",
        "Let's think about what's within your control right now."
      ],
      neutral: [
        "Thanks for sharing. Would you like to tell me more?",
        "I'm listening. How has this been affecting you?",
        "I hear you. What else is on your mind today?"
      ]
    };
  }

  getResponse(emotions, conversationHistory) {
    const primaryEmotion = emotions[0];
    
    // Get all possible responses for this emotion
    let possibleResponses = [
      ...(this.baseResponses[primaryEmotion] || []),
      ...(this.successfulResponses[primaryEmotion] || [])
    ].filter(response => 
      !this.avoidPhrases[primaryEmotion]?.some(phrase => 
        response.toLowerCase().includes(phrase.toLowerCase())
      )
    );

    // Fallback if all responses filtered out
    if (possibleResponses.length === 0) {
      possibleResponses = this.baseResponses.neutral;
    }

    // Select response using weighted randomness
    const selectedResponse = this.selectWeightedResponse(possibleResponses, primaryEmotion);
    
    // Track that this response was used
    this.trackResponseUsage(selectedResponse, primaryEmotion);
    
    return selectedResponse;
  }

  selectWeightedResponse(responses, emotion) {
    // Initialize weights if not exists
    if (!this.responseWeights[emotion]) {
      this.responseWeights[emotion] = {};
      responses.forEach(response => {
        this.responseWeights[emotion][response] = 1;
      });
    }
    
    // Calculate total weight
    const totalWeight = responses.reduce((sum, response) => 
      sum + (this.responseWeights[emotion][response] || 1), 0);
    
    // Select random value within total weight
    let random = Math.random() * totalWeight;
    let weightSum = 0;
    
    for (const response of responses) {
      weightSum += this.responseWeights[emotion][response] || 1;
      if (random <= weightSum) return response;
    }
    
    return responses[0]; // Fallback
  }

  trackResponseUsage(response, emotion) {
    if (!this.responseEffectiveness[emotion]) {
      this.responseEffectiveness[emotion] = {};
    }
    
    if (!this.responseEffectiveness[emotion][response]) {
      this.responseEffectiveness[emotion][response] = {
        uses: 0,
        positiveOutcomes: 0
      };
    }
    
    this.responseEffectiveness[emotion][response].uses += 1;
  }

  updateResponseEffectiveness(response, emotion, wasEffective) {
    if (!this.responseEffectiveness[emotion]?.[response]) return;
    
    if (wasEffective) {
      this.responseEffectiveness[emotion][response].positiveOutcomes += 1;
      
      // Add to successful responses if not already there
      if (!this.successfulResponses[emotion]) {
        this.successfulResponses[emotion] = [];
      }
      
      if (!this.successfulResponses[emotion].includes(response)) {
        this.successfulResponses[emotion].push(response);
      }
      
      // Increase weight
      if (!this.responseWeights[emotion]) {
        this.responseWeights[emotion] = {};
      }
      
      this.responseWeights[emotion][response] = 
        (this.responseWeights[emotion][response] || 1) * 1.2;
    } else {
      // Decrease weight
      if (this.responseWeights[emotion]?.[response]) {
        this.responseWeights[emotion][response] *= 0.8;
      }
      
      // If response consistently performs poorly, add phrases to avoid
      const effectiveness = this.responseEffectiveness[emotion][response];
      const failureRate = 1 - (effectiveness.positiveOutcomes / effectiveness.uses);
      
      if (effectiveness.uses > 3 && failureRate > 0.7) {
        this.identifyProblematicPhrases(response, emotion);
      }
    }
    
    this.saveLearnedData();
  }

  identifyProblematicPhrases(response, emotion) {
    // Simple problematic phrase detection
    const problematicPhrases = [
      'just',
      'should',
      'only',
      'simply',
      'cheer up',
      'calm down'
    ];
    
    const foundPhrases = problematicPhrases.filter(phrase => 
      response.toLowerCase().includes(phrase)
    );
    
    if (foundPhrases.length > 0) {
      if (!this.avoidPhrases[emotion]) {
        this.avoidPhrases[emotion] = [];
      }
      
      foundPhrases.forEach(phrase => {
        if (!this.avoidPhrases[emotion].includes(phrase)) {
          this.avoidPhrases[emotion].push(phrase);
        }
      });
    }
  }

  saveLearnedData() {
    if (typeof window !== 'undefined') {
      const data = {
        successfulResponses: this.successfulResponses,
        avoidPhrases: this.avoidPhrases,
        responseWeights: this.responseWeights,
        responseEffectiveness: this.responseEffectiveness
      };
      
      localStorage.setItem('responseGeneratorData', JSON.stringify(data));
    }
  }

  loadLearnedData() {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('responseGeneratorData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          this.successfulResponses = data.successfulResponses || {};
          this.avoidPhrases = data.avoidPhrases || {};
          this.responseWeights = data.responseWeights || {};
          this.responseEffectiveness = data.responseEffectiveness || {};
        } catch (e) {
          console.error('Failed to load response generator data:', e);
        }
      }
    }
  }
}