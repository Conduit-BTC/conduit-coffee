import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useReceiptContext } from '../../context/ReceiptContext';
import { ConfettiEffect } from '../../components/ConfettiEffect';

const EmailModalLayout = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const { receipt } = useReceiptContext();

  const handleEmailReceipt = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices/email-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, receipt }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col mt-16 bg-[#1a1b26]/80 rounded-lg p-4">
      <h2 className="mb-2">Send an Email Receipt</h2>
      <h6 className="mb-8">Enter an email address where you would like to receive your receipt</h6>
      <input
        className="w-full p-2 mt-4"
        type="email"
        placeholder="Email"
        id="checkout-email"
        name="checkout-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={handleEmailReceipt}
        disabled={!email || isLoading}
        className="w-full p-2 mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
                 text-white rounded-md flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Sending...
          </>
        ) : (
          'Send Email'
        )}
      </button>

      {/* Status Messages */}
      {status && (
        <div className="mt-6">
          {status === 'success' && (
            <div className="rounded-lg bg-[#1e2028] p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="text-green-500" size={24} />
                <span className="text-green-500 font-bold text-lg">
                  Receipt Sent Successfully!
                </span>
              </div>
              <div className="text-gray-400 pl-8">
                Check your email inbox for the receipt
              </div>
              <ConfettiEffect />
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg bg-red-950/30 border border-red-800/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-red-500" size={24} />
                <span className="text-red-500 font-bold text-lg">
                  Failed to Send Receipt
                </span>
              </div>
              <div className="text-red-400 pl-8">
                Please try again or contact support if the problem persists
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailModalLayout;
