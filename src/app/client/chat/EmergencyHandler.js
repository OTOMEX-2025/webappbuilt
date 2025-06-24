export default class EmergencyHandler {
  static handleEmergency() {
    return {
      immediateResponse: "I'm really concerned about what you're sharing. Your life is precious. Please call the National Suicide Prevention Lifeline at 011-715-2000 right now. You're not alone, and help is available.",
      followUpActions: [
        "Display emergency contacts full screen",
        "Suggest calling a trusted friend or family member",
        "Offer to guide through grounding exercise"
      ],
      resources: [
        "In South Africa: Call 0800 567 567 for the Suicide Crisis Helpline (SADAG)",
        "SMS 31393 to have a counselor call you back",
        "Call 0861 322 322 for Lifeline South Africa 24/7 support"
      ]
    };
  }

  static getEmergencyResources() {
    return [
        "South Africa Suicide Prevention Line (SADAG): 0800 567 567",
        "SMS 31393 to speak with a crisis counselor via callback",
        "LGBTQ+ Support (OUT): Call 012 430 3272 or email health@out.org.za",
        "Veterans & Trauma Support (Lifeline): 0861 322 322"
    ];
  }
}