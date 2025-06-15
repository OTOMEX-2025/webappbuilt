import { getData, saveData } from '@/lib/data';

export async function GET(request, { params }) {
  try {
    // Correct way to access params - no need to await
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const data = await getData();
    
    // Search across all meeting types with null checks
    const allMeetings = [
      ...(data.meetings?.upcoming || []),
      ...(data.meetings?.past || []),
      ...(data.meetings?.canceled || [])
    ];
    
    const meeting = allMeetings.find(m => m.id === id);
    
    if (!meeting) {
      return Response.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }
    
    return Response.json(meeting, { status: 200 });
  } catch (error) {
    console.error('GET /api/clt/meetings/[id] error:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Correct params access
    const { id } = params;
    const updateData = await request.json();
    
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
        { error: "Meeting not found or not modifiable" },
        { status: 404 }
      );
    }
    
    // Update meeting while preserving the ID
    const updatedMeeting = { 
      ...data.meetings.upcoming[meetingIndex],
      ...updateData,
      id: data.meetings.upcoming[meetingIndex].id // Ensure ID remains unchanged
    };
    
    data.meetings.upcoming[meetingIndex] = updatedMeeting;
    await saveData(data);
    
    return Response.json(
      { success: true, meeting: updatedMeeting },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/clt/meetings/[id] error:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Correct params access
    const { id } = params;
    
    if (!id) {
      return Response.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const data = await getData();
    let meetingRemoved = false;
    
    // Check all meeting categories
    const categories = ['upcoming', 'past', 'canceled'];
    for (const category of categories) {
      const index = data.meetings[category].findIndex(m => m.id === id);
      if (index !== -1) {
        data.meetings[category].splice(index, 1);
        meetingRemoved = true;
        break;
      }
    }
    
    if (!meetingRemoved) {
      return Response.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }
    
    await saveData(data);
    
    return Response.json(
      { success: true, message: "Meeting deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/clt/meetings/[id] error:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}