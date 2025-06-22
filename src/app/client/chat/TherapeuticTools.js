export default class TherapeuticTools {
  constructor() {
    this.exercises = {
      breathing: this.breathingExercise.bind(this),
      gratitude: this.gratitudePrompt.bind(this),
      grounding: this.groundingExercise.bind(this)
    };
  }

  breathingExercise() {
    return {
      instructions: "Let's do a calming breathing exercise together:\n\n1. Breathe in slowly for 4 seconds...\n2. Hold your breath for 4 seconds...\n3. Breathe out slowly for 6 seconds...\n\nRepeat this cycle 3-5 times. Notice how your body feels with each breath.",
      duration: "2 minutes"
    };
  }

  gratitudePrompt() {
    const prompts = [
      "What's one small thing that went well today, no matter how small?",
      "Who is someone you're grateful to have in your life? What do you appreciate about them?",
      "What's a personal strength you're proud of?",
      "What's something beautiful or interesting you noticed recently?",
      "What's a challenge you've faced that helped you grow?"
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  groundingExercise() {
    return {
      instructions: "When feeling overwhelmed, try this 5-4-3-2-1 grounding technique:\n\n1. Name 5 things you can see\n2. Name 4 things you can touch\n3. Name 3 things you can hear\n4. Name 2 things you can smell\n5. Name 1 thing you can taste\n\nThis helps bring your focus to the present moment.",
      duration: "1-2 minutes"
    };
  }

  getExercise(name) {
    return this.exercises[name] ? this.exercises[name]() : null;
  }
}