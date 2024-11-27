import { useState } from 'react';
import { useReceiptContext } from '../../context/ReceiptContext';

const EmailModalLayout = () => {
    const [email, setEmail] = useState('');
    const {receipt} = useReceiptContext();

  const handleEmailReceipt = async () => {
    if (!email) {
      return;
    }
    await fetch('/invoices/email-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, receipt }),
    });
  };

    return (
    <div className="relative flex flex-col mt-16 bg-[#1a1b26]/80 rounded-lg p-4">
        <h2 className="text-xl font-bold">Email Receipt</h2>
        <input
          className="w-full p-2 mt-4"
          type="email"
          placeholder="Email"
          id="checkout-email"
          name="checkout-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailReceipt} className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md">Send Email</button>
    </div>
)
};

export default EmailModalLayout;
