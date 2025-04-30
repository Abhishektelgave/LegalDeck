'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppointmentStore } from '@/app/store/appointment';
import { useSession } from 'next-auth/react';
import LoadingPage from '../components/LoadingPage';

// Meeting Room Page
const CallRoom = () => {

  // Basic data
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const jitsiRef = useRef(null);
  const scriptLoaded = useRef(false);
  const { data: session } = useSession();
  const appt = useAppointmentStore((state) => state.appt);
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  // Send email on mount
  useEffect(() => {
    const sendEmail = async () => {
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: appt?.userEmail,
            subject: 'Appointment Call Started',
            message: `<p>Hi ${appt?.userName},</p>
                      <p>Your video consultation has started. Please join using the link below:</p>
                      <p><a href="http://localhost:3000/callRoom?roomId=${roomId}">Join Call</a></p>`,
          }),
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    if (appt?.userEmail && appt?.userName) {
      sendEmail();
    }
  }, [appt?.userEmail, appt?.userName, roomId]);

  // JITSI Room creation
  useEffect(() => {
    setLoading(true);
    try {
      const loadJitsi = () => {
        if (jitsiRef.current || !window.JitsiMeetExternalAPI) return;

        const domain = '8x8.vc';
        const options = {
          roomName: `vpaas-magic-cookie-88730f272325407e84ebca4ce068137c/${roomId}`,
          parentNode: document.getElementById('jitsi-container'),
          width: '100%',
          height: '100%',
          userInfo: {
            displayName: session?.user?.name || 'Lawyer',
          },
          configOverwrite: {
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        };

        const jitsi = new window.JitsiMeetExternalAPI(domain, options);
        jitsiRef.current = jitsi;

        jitsi.addEventListener('readyToClose', async () => {
          if (session?.user?.role === 'lawyer') {
            const res = await fetch('/api/book/appointment/updateAppointment/completedAppt', {
              method: "POST",
              body: JSON.stringify({ id: appt._id, status: 'completed' })
            })
            router.push(`/CaseProgress/${appt.caseId}`);
          } else {
            router.push('/UserDashboard');
          }
        });
      };
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }

    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/external_api.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        loadJitsi();
      };
      document.body.appendChild(script);
    } else {
      loadJitsi();
    }

    return () => {
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
        jitsiRef.current = null;
      }
    };
  }, [roomId, session?.user?.role, router]);

  if (loading) return <LoadingPage />

  return <div id="jitsi-container" className="w-screen h-screen bg-black" />;
};

export default CallRoom;
