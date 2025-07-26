"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

const SubscriptionCancel = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
                <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Subscription Cancelled
                </h1>
                <p className="text-gray-600 mb-6">
                    You’ve cancelled the subscription process. No payment has
                    been made.
                </p>
                <button
                    onClick={() => router.back()}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition duration-200"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="block mt-4 text-sm text-gray-500 hover:underline"
                >
                    Go back to homepage
                </Link>
            </div>
        </div>
    );
};

export default SubscriptionCancel;
