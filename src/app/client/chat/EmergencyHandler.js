export default class EmergencyHandler {
  static handleEmergency() {
    return {
      immediateResponse: "I'm really concerned about what you're sharing. Your life is precious. Please call the National Suicide Prevention Lifeline at 1-800-273-8255 right now. You're not alone, and help is available.",
      followUpActions: [
        "Display emergency contacts full screen",
        "Suggest calling a trusted friend or family member",
        "Offer to guide through grounding exercise"
      ],
      resources: [
        "In the U.S.: Call 988 for the Suicide & Crisis Lifeline",
        "International: Find local crisis lines at www.befrienders.org",
        "Text HOME to 741741 to connect with a crisis counselor"
      ]
    };
  }

  static getEmergencyResources() {
    return [
      "National Suicide Prevention Lifeline: 1-800-273-8255",
      "Crisis Text Line: Text HOME to 741741",
      "Trevor Project (LGBTQ+): 1-866-488-7386",
      "Veterans Crisis Line: 1-800-273-8255, press 1"
    ];
  }
}