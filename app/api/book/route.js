import connectDB from '@/app/db/page';
import Appointment from '@/app/models/Appointment';
import Case from '@/app/models/Case';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {

    let { caseId, lawyerId, userId, fee, category, date, time } = body;

    if(!caseId || !lawyerId || !userId || !fee || !category || !date || !time){
      return new Response(JSON.stringify({message:'Missing Parameters'}),{status:404})
    }

    // If it's a new case, create one
    if (caseId === 'New') {
      const newCase = new Case({
        lawyerId,
        userId,
        category,
        fee,
      });
      await newCase.save();
      caseId = newCase._id;
    }

    // Create the appointment with the proper case ID
    const appointment = new Appointment({
      lawyerId,
      userId,
      caseId,
      date,
      time,
      category,
    });

    await appointment.save();

    return new Response(
      JSON.stringify({ message: 'Appointment successfully booked.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Booking failed.', error: error.message }),
      { status: 500 }
    );
  }
}
