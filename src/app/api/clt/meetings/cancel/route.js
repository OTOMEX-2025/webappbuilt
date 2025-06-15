import { getData, saveData } from '@/lib/data';

export async function POST(request) {
  const { id, reason } = await request.json();
  const data = await getData();
  
  const meetingIndex = data.meetings.upcoming.findIndex(m => m.id === id);
  
  if (meetingIndex === -1) {
    return Response.json({ success: false, message: "Meeting not found or not upcoming" }, { status: 404 });
  }
  
  // Move to canceled
  const canceledMeeting = {
    ...data.meetings.upcoming[meetingIndex],
    status: "canceled",
    cancelReason: reason || "No reason provided"
  };
  
  data.meetings.canceled.push(canceledMeeting);
  data.meetings.upcoming.splice(meetingIndex, 1);
  
  await saveData(data);
  
  return Response.json({ 
    success: true, 
    message: "Meeting canceled successfully",
    meeting: canceledMeeting
  });
}