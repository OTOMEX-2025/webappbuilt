import { getData, saveData } from '@/lib/data';

// Helper function to find meeting by ID
async function findMeetingById(id) {
  const data = await getData();
  const allMeetings = [...data.meetings.upcoming, ...data.meetings.past, ...data.meetings.canceled];
  return allMeetings.find(m => m.id === id);
}

export async function GET() {
  const data = await getData();
  return Response.json(data.meetings);
}

export async function POST(request) {
  const data = await getData();
  const meeting = await request.json();
  
  // Generate ID
  const newId = `m${Date.now()}`;
  const newMeeting = {
    id: newId,
    status: "scheduled",
    participants: 0,
    ...meeting
  };
  
  data.meetings.upcoming.push(newMeeting);
  await saveData(data);
  
  return Response.json(newMeeting);
}

export async function PUT(request) {
  const data = await getData();
  const { id, action, ...updateData } = await request.json();
  
  let meeting;
  let responseMessage = {};
  
  if (action === 'cancel') {
    const index = data.meetings.upcoming.findIndex(m => m.id === id);
    if (index !== -1) {
      meeting = data.meetings.upcoming[index];
      meeting.status = "canceled";
      meeting.cancelReason = updateData.reason || "No reason provided";
      data.meetings.canceled.push(meeting);
      data.meetings.upcoming.splice(index, 1);
      responseMessage = { success: true, message: "Meeting canceled successfully" };
    }
  } else if (action === 'reschedule') {
    const index = data.meetings.upcoming.findIndex(m => m.id === id);
    if (index !== -1) {
      meeting = data.meetings.upcoming[index];
      meeting.date = updateData.newDate;
      data.meetings.upcoming[index] = meeting;
      responseMessage = { success: true, message: "Meeting rescheduled successfully" };
    }
  } else if (action === 'join') {
    const index = data.meetings.upcoming.findIndex(m => m.id === id);
    if (index !== -1) {
      meeting = data.meetings.upcoming[index];
      meeting.participants = (meeting.participants || 0) + 1;
      data.meetings.upcoming[index] = meeting;
      responseMessage = { success: true, message: "Joined meeting successfully" };
    }
  } else if (action === 'update') {
    const index = data.meetings.upcoming.findIndex(m => m.id === id);
    if (index !== -1) {
      meeting = data.meetings.upcoming[index];
      data.meetings.upcoming[index] = { ...meeting, ...updateData };
      responseMessage = { success: true, message: "Meeting updated successfully" };
    }
  } else if (action === 'update') {
  const index = data.meetings.upcoming.findIndex(m => m.id === id);
  if (index !== -1) {
    meeting = data.meetings.upcoming[index];
    data.meetings.upcoming[index] = { ...meeting, ...updateData };
    responseMessage = { success: true, message: "Meeting updated successfully" };
  }
}
  
  await saveData(data);
  return Response.json(responseMessage.success ? responseMessage : { success: false, message: "Operation failed" });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const data = await getData();
  let responseMessage = {};
  
  // Check all meeting types and remove if found
  const upcomingIndex = data.meetings.upcoming.findIndex(m => m.id === id);
  const pastIndex = data.meetings.past.findIndex(m => m.id === id);
  const canceledIndex = data.meetings.canceled.findIndex(m => m.id === id);
  
  if (upcomingIndex !== -1) {
    data.meetings.upcoming.splice(upcomingIndex, 1);
    responseMessage = { success: true, message: "Meeting deleted successfully" };
  } else if (pastIndex !== -1) {
    data.meetings.past.splice(pastIndex, 1);
    responseMessage = { success: true, message: "Past meeting deleted successfully" };
  } else if (canceledIndex !== -1) {
    data.meetings.canceled.splice(canceledIndex, 1);
    responseMessage = { success: true, message: "Canceled meeting deleted successfully" };
  } else {
    responseMessage = { success: false, message: "Meeting not found" };
  }
  
  await saveData(data);
  return Response.json(responseMessage);
}