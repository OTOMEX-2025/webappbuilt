import { getData, saveData } from '@/lib/data';

export async function GET(request, { params }) {
  const { id } = params;
  const data = await getData();
  
  // Search in all meeting types
  const allMeetings = [...data.meetings.upcoming, ...data.meetings.past, ...data.meetings.canceled];
  const meeting = allMeetings.find(m => m.id === id);
  
  if (!meeting) {
    return Response.json({ error: "Meeting not found" }, { status: 404 });
  }
  
  return Response.json(meeting);
}
export async function POST(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return Response.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const data = await getData();
    const meetingIndex = data.meetings.upcoming.findIndex(m => m.id === id);
    
    if (meetingIndex === -1) {
      return Response.json(
        { error: "Meeting not found or not joinable" },
        { status: 404 }
      );
    }
    
    // Increment participants safely
    const currentParticipants = data.meetings.upcoming[meetingIndex].participants || 0;
    data.meetings.upcoming[meetingIndex].participants = currentParticipants + 1;
    
    await saveData(data);
    
    return Response.json(
      { 
        success: true,
        participants: data.meetings.upcoming[meetingIndex].participants
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/clt/meetings/join error:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}