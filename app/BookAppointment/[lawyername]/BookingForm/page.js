'use client';
import { useContext, useState, useEffect } from 'react';
import { LawyerContext } from '@/app/context/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CaseSelector from '@/app/BookAppointment/components/CaseSelector';
import LoadingPage from '@/app/components/LoadingPage';

const BookingForm = ({ params }) => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('New Case');
  const lawyer = useContext(LawyerContext);
  const router = useRouter();

  const [form, setForm] = useState({
    caseId: 'New',
    date: '',
    time: '',
    category: '',
    fee: 0,
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [loading, setLoading] = useState(true);


  const today = new Date().toISOString().split('T')[0];
  const minDateObj = new Date();
  const maxDateObj = new Date();
  minDateObj.setDate(minDateObj.getDate() + 1);
  maxDateObj.setDate(maxDateObj.getDate() + 6);
  const minDate = minDateObj.toISOString().split('T')[0];
  const maxDate = maxDateObj.toISOString().split('T')[0];


  useEffect(() => {
    if (!session) router.push('/Auth/Login');
  }, [session, status, router]);

  useEffect(() => {
    setLoading(true);
    const fetchCaseDetails = async () => {
      if (!selectedCaseId) return;

      try {
        const res = await fetch(`/api/case?id=${selectedCaseId}`);
        const data = await res.json();

        if (res.ok) {
          setForm((prev) => ({
            ...prev,
            lawyerId: lawyer._id,
            userId: session.user.id,
            caseId: selectedCaseId,
            category: data.caseDetails.category || '',
            fee: data.caseDetails.fee || 0,
          }));

        } else {
          setMessage(data.message || 'Failed to fetch case details');
        }
      } catch (err) {
        console.error(err);
        setMessage('Error fetching case details');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [selectedCaseId]);



  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    const dayOfWeek = new Date(selectedDate).getDay(); // 0=Sunday, 6=Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Don't allow selection of Saturday or Sunday
      alert('Weekends are not allowed. Please select a weekday.');
      setForm((prev) => ({ ...prev, date: '', time: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, date: selectedDate, time: '' }));


    if (!lawyer?._id || !selectedDate) return;

    try {
      setLoadingSlots(true);
      const res = await fetch(`/api/book/availableSlots?lawyerId=${lawyer._id}&date=${selectedDate}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId: lawyer._id,
          userId: session.user.id,
          caseId: activeTab === 'New Case' ? 'New' : selectedCaseId,
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
        setForm({ caseId: 'New', date: '', time: '', category: '', fee: 0 });
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
      <>
        {/* Active Tabs selection */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setActiveTab('New Case')}
            className={`px-6 py-2 rounded-full cursor-pointer text-sm sm:text-lg font-semibold ${activeTab === 'New Case' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            New Case
          </button>
          <button
            onClick={() => setActiveTab('Continue Case')}
            className={`px-6 py-2 rounded-full cursor-pointer text-sm sm:text-lg font-semibold ${activeTab === 'Continue Case' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            Continue Case
          </button>
        </div>

        {/* Main Form */}
        <main className="w-[80vw] md:w-[40vw] sm:w-[50vw]">
          {message ? (
            <p className="text-center text-red-400">{message}</p>
          ) : activeTab === 'New Case' ? (
            <div className="w-full mx-auto bg-[#1e1e1e] text-white p-6 rounded-lg shadow-md">
              <h2 className=" text-sm sm:text-lg  font-bold mb-4">
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
                    min={minDate}
                    max={maxDate}
                  />
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block mb-1">Select Time</label>
                  {loadingSlots ? (
                    <span className="text-sm text-gray-400">Loading Slots ....</span>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <label
                          key={slot}
                          className={`cursor-pointer py-2 px-4 rounded text-center 
                            ${form.time === slot ? 'bg-[#FF6F61] text-white' : 'bg-[#2c2c2c] text-gray-300 hover:bg-[#3c3c3c]'}`}
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

                {/* Category */}
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

                {/* Fee */}
                {form.category && lawyer.categories?.[form.category]?.fee > 0 && (
                  <p className="text-sm text-green-400 mt-2">
                    Total Fee for {lawyer.categories[form.category].name} – ₹{lawyer.categories[form.category].fee}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-[#FF6F61] hover:bg-[#ff5a4d] text-white font-semibold py-2 px-4 rounded"
                  disabled={!form.date || !form.time || !form.category}
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full mx-auto bg-[#1e1e1e] text-white p-6 rounded-lg shadow-md">
              <h2 className=" text-sm sm:text-lg  font-bold mb-4">
                Book Next Appointment with {lawyer.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Select Case</label>
                  <CaseSelector userId={session?.user?.id} lawyerId={lawyer._id} onSelect={setSelectedCaseId} />
                </div>

                <div>
                  <label className="block mb-1">Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleDateChange}
                    className="w-full bg-[#2c2c2c] text-white border border-gray-600 rounded p-2"
                    required
                    min={minDate}
                    max={maxDate}
                  />
                </div>

                <div>
                  <label className="block mb-1">Select Time</label>
                  {loadingSlots ? (
                    <span className="text-sm text-gray-400">Loading slots...</span>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <label
                          key={slot}
                          className={`cursor-pointer py-2 px-4 rounded text-center 
                            ${form.time === slot ? 'bg-[#FF6F61] text-white' : 'bg-[#2c2c2c] text-gray-300 hover:bg-[#3c3c3c]'}`}
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

                <button
                  type="submit"
                  className="w-full bg-[#FF6F61] cursor-pointer hover:bg-[#ff5a4d] text-white font-semibold py-2 px-4 rounded"
                  disabled={!form.date || !form.time}
                >
                  Confirm Appointment
                </button>
              </form>
            </div>
          )}
        </main>
      </>
    );
  }

  return null;
};

export default BookingForm;
