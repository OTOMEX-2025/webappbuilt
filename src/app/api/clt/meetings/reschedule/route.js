import { getData, saveData } from '@/lib/data';

export async function POST(request) {
  const { id, newDate } = await request.json();
  const data = await getData();
  
  const meetingIndex = data.meetings.upcoming.findIndex(m => m.id === id);
  
  if (meetingIndex === -1) {
    return Response.json({ success: false, message: "Meeting not found or not upcoming" }, { status: 404 });
  }
  
  // Update date
  data.meetings.upcoming[meetingIndex].date = newDate;
  
  await saveData(data);
  
  return Response.json({ 
    success: true, 
    message: "Meeting rescheduled successfully",
    meeting: data.meetings.upcoming[meetingIndex]
  });
}