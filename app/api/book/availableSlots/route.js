import dbConnect from '@/app/db/page';
import Appointment from '@/app/models/Appointment';
import dayjs from 'dayjs';

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const lawyerId = searchParams.get('lawyerId');
    const date = searchParams.get('date');

    if (!lawyerId || !date) {
      return new Response(JSON.stringify({ message: 'Missing queary parameters' }), { status: 400 })
    }

    await dbConnect();

    const DURATION = 60; // minutes
    const WORK_START = dayjs(`${date} 10:00`);
    const WORK_END = dayjs(`${date} 20:00`);
    const BREAKS = [{ start: dayjs(`${date} 13:00`), end: dayjs(`${date} 14:00`) }];

    let slots = [];
    let current = WORK_START;

    while (current.add(DURATION, 'minute').isBefore(WORK_END)) {
      const inBreak = BREAKS.some(b => current.isAfter(b.start) && current.isBefore(b.end));
      if (!inBreak) {
        slots.push(current.format('HH:mm'));
      }
      current = current.add(DURATION, 'minute');
    }

    const appointments = await Appointment.find({ lawyerId, date });
    const bookedTimes = appointments.map(a => a.time);

    const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

    return new Response(JSON.stringify({ slots: availableSlots }), { status: 200 })


  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Server error:' + err.message }), { status: 500 })

  }
}
