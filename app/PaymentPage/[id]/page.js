"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/LoadingPage";

const PaymentPage = ({ params }) => {
  const id = React.use(params).id;
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const res = await fetch(`/api/case/getCaseDetails?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setCaseDetails(data);
          if (data.payment === 'completed') {
            router.push('/PaymetAlreadyCompleted')
          }
        } else {
          console.error("Error fetching case details:", data.message);
        }
      } catch (err) {
        console.error("Unable to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      fetchCaseDetails();
    }
  }, [session, id]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay SDK loaded");
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
      };
      document.body.appendChild(script);
    }
  }, []);


  const handlePayment = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      amount: caseDetails.fee,
      to_user: caseDetails.userId,
      from_user: caseDetails.lawyerId,
      upi: caseDetails.upi,
    };

    try {
      const response = await fetch("/api/actions/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });
      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.message || "Failed to initiate transaction");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "LegalDeck",
        description: "Online Legal Consultation Platform",
        order_id: orderData.id,
        handler: async (response) => {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            case_id: id,
          };

          const verificationRes = await fetch("/api/actions/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verificationData),
          });

          const result = await verificationRes.json();
          if (!verificationRes.ok) throw new Error(result.message || "Verification failed");

          router.push(`/BookAppointment/${caseDetails.lawyerName}/Ratings`)
        },
        prefill: {
          name: caseDetails.lawyerName,
          email: caseDetails.lawyerEmail,
        },
        theme: {
          color: "#FF6F61",
        },
      };

      if (typeof window.Razorpay !== "function") {
        return console.error("Razorpay SDK not yet loaded");
      }
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Transaction failed", error.message);
    }
  };

  if (!session || loading) {
    return <div className="text-center py-20 text-white"><LoadingPage /></div>;
  }

  if (!caseDetails) {
    return <div className="text-center py-20 text-white">No case found.</div>;
  }

  return (
    <div className="h-[80vh]">
      <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative mx-auto my-20 max-w-2xl">

        <h2 className="text-2xl font-semibold mb-4 text-center text-white">Payment Details</h2>

        <div className="flex justify-between items-center mb-4 text-white">
          <div>
            <p className="text-xs uppercase text-white/60">From</p>
            <p className="text-sm font-semibold">{caseDetails.userName || "Unknown User"}</p>
          </div>
          <div className="w-12 h-[2px] bg-white/40 rounded-full" />
          <div>
            <p className="text-xs uppercase text-white/60">To</p>
            <p className="text-sm font-semibold">{caseDetails.lawyerName}</p>
          </div>
        </div>

        <div className="text-sm text-white space-y-2 mb-6">
          <p><strong className="text-gray-300">Case ID:</strong> {caseDetails._id}</p>
          <p><strong className="text-gray-300">Category:</strong> {caseDetails.category || "N/A"}</p>
          <p><strong className="text-gray-300">Status:</strong> {caseDetails.status}</p>
          <p><strong className="text-gray-300">Fee:</strong> ₹{caseDetails.fee}</p>
          <p><strong className="text-gray-300">Lawyer UPI:</strong> {caseDetails.upi || "Not Provided"}</p>
        </div>

        <form onSubmit={handlePayment} className="flex justify-center">
          <button
            type="submit"
            className="text-[#000000] cursor-pointer bg-[#e9efed] hover:bg-[#ffffff] border border-white rounded-full px-6 py-2 font-semibold"
          >
            Pay ₹{caseDetails.fee}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
