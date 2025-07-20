"use client";
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

// Your defined plans
const pricingPlans = [
  {
    credits: 10,
    price: 9,
    description: "Perfect for trying things out.",
  },
  {
    credits: 25,
    price: 19,
    description: "Best value for regular users.",
  },
  {
    credits: 60,
    price: 49,
    description: "For power users and creators.",
  },
];

function BillingPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-4">Buy More Credits</h1>
      <p className="text-center text-gray-500 mb-10">
        Choose a plan that fits your needs. After payment, follow the instructions below to get your credits.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Pricing Plans Section */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card key={plan.credits} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.credits} Credits</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-4xl font-extrabold mb-4">₹{plan.price}</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Generate Videos & Images</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Access All Features</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-50 dark:bg-gray-900 p-6">
            <CardHeader className="p-0 text-center">
              <CardTitle className="mb-2">Scan to Pay</CardTitle>
              <CardDescription>Use any UPI app like GPay, PhonePe, or Paytm.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              {/* --- FIX IS HERE --- */}
              {/* Make sure your QR code image is located at: public/images/upi-qr-code.jpeg */}
              <div className="my-4 p-2 bg-white rounded-lg">
                <Image 
                  src="/images/upi-qr-code.jpeg" 
                  alt="UPI QR Code"
                  width={250}
                  height={250}
                />
              </div>
              <p className="font-mono text-sm">
                UPI ID: <strong>banerjee.delta@oksbi</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions After Payment */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-center mb-4">After Payment - What's Next?</h2>
        <div className="max-w-2xl mx-auto text-center bg-yellow-100 dark:bg-yellow-900/30 p-6 rounded-lg">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">
            After successful payment, contact us with the payment proof and your registered Gmail ID at:
          </p>
          <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
            pratyushbanerjee475@gmail.com
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Your credits will be added to your account within a few hours after verification.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;