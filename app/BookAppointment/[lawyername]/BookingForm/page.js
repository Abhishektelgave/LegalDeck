'use client';
import { useContext, useState } from 'react';
import { LawyerContext } from '@/app/context/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const BookingForm = ({ params }) => {
  const { data: session } = useSession();
  const lawyer = useContext(LawyerContext);
  const router = useRouter();

  const [form, setForm] = useState({
    date: '',
    time: '',
    category: '',
    fee: 0,
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // date selection
  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setForm((prev) => ({ ...prev, date: selectedDate, time: '' }));
    if (!lawyer?._id || !selectedDate) return;

    try {
      setLoadingSlots(true);
      const res = await fetch(
        `/api/book/availableSlots?lawyerId=${lawyer._id}&date=${selectedDate}`
      );
      const data = await res.json();

      if (res.ok) {
        setAvailableSlots(data.slots);
        setMessage('');
      } else {
        setAvailableSlots([]);
        setMessage(data.message || 'Failed to fetch slots.');
      }
    } catch (err) {
      setAvailableSlots([]);
      setMessage('Error fetching available slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeChange = (e) => {
    setForm((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selected = lawyer.categories?.[selectedCategory];
    setForm((prev) => ({
      ...prev,
      category: selectedCategory,
      fee: selected?.fee || 0,
    }));
  };

  // Book Appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId: lawyer._id,
          userId: session.user.id,
          date: form.date,
          time: form.time,
          category: form.category,
          fee: form.fee,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid server response.');
      }

      if (res.ok) {
        setMessage(data.message || 'Appointment booked!');
        setForm({ date: '', time: '', category: '', fee: 0 });
        setAvailableSlots([]);

        setTimeout(() => {
          router.push(`/UserDashboard`);
        }, 1000);
      } else {
        setMessage(data.message || 'Failed to book appointment.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'An error occurred.');
    }
  };

  if (session && lawyer) {
    return (
      <div className="w-full max-w-xl mx-auto bg-[#1e1e1e] text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Book Appointment with {lawyer.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block mb-1">Select Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleDateChange}
              className="w-full bg-[#2c2c2c] text-white border border-gray-600 rounded p-2"
              required
              min={today}
            />
          </div>

          {/* Time Selection as Grid Buttons */}
          <div>
            <label className="block mb-1">Select Time</label>
            {loadingSlots ? (
              <p className="text-sm text-gray-400">Loading slots...</p>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`cursor-pointer py-2 px-4 rounded text-center 
                      ${form.time === slot
                        ? 'bg-[#FF6F61] text-white'
                        : 'bg-[#2c2c2c] text-gray-300 hover:bg-[#3c3c3c]'}`}
                  >
                    <input
                      type="radio"
                      name="time"
                      value={slot}
                      checked={form.time === slot}
                      onChange={handleTimeChange}
                      className="hidden"
                    />
                    {slot}
                  </label>
                ))}
              </div>
            ) : form.date ? (
              <p className="text-sm text-yellow-400">No available slots</p>
            ) : (
              <p className="text-sm text-gray-400">Please select a date</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1">Select Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full bg-[#2c2c2c] text-white border border-gray-600 rounded p-2"
              required
            >
              <option value="">-- Select Category --</option>
              {lawyer.categories &&
                Object.entries(lawyer.categories).map(([key, value]) =>
                  value?.name ? (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ) : null
                )}
            </select>
          </div>

          {/* Fee Display */}
          {form.category && lawyer.categories?.[form.category]?.fee > 0 && (
            <p className="text-sm text-green-400 mt-2">
              Meeting held for {lawyer.categories[form.category].name} – Fee: ₹
              {lawyer.categories[form.category].fee}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FF6F61] hover:bg-[#ff5a4d] text-white font-semibold py-2 px-4 rounded"
            disabled={!form.date || !form.time || !form.category}
          >
            Confirm Appointment
          </button>
        </form>

        {message && <p className="mt-4 text-green-400">{message}</p>}
      </div>
    );
  }

  return null;
};

export default BookingForm;
