"use client";

import AiFeatures from "@/components/home/ai-features";
import Banner from "@/components/home/banner";
import DesignTypes from "@/components/home/design-types";
import DesignsModal from "@/components/home/designs-modal";
import Header from "@/components/home/header";
import RecentDesigns from "@/components/home/recent-designs";
import Sidebar from "@/components/home/sidebar";
import SubscriptionModal from "@/components/subscription/premium-modal";
import { getUserDesigns } from "@/services/design-service";
import { getUserSubscription } from "@/services/subscription-service";
import { useEditorStore } from "@/store";
import { useEffect } from "react";

export default function Home() {
    const { setUserSubscription, setUserDesigns, showPremiumModal, setShowPremiumModal, showDesignsModal, setShowDesignsModal, setUserDesignsLoading } = useEditorStore();

    const fetchUserSubscription = async () => {
        const response = await getUserSubscription();
        if (result?.success) {
            setUserSubscription(response.data);
        }
    };

    const fetchUserDesigns = async () => {
        setUserDesignsLoading(true)
        const result = await getUserDesigns();
        if (result?.success) {
            setUserDesigns(result.data);
        }
        setUserDesignsLoading(false)
    };

    useEffect(() => {
        fetchUserSubscription();
        fetchUserDesigns();
    }, []);

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-[72px]">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto pt-20">
                    <Banner />
                    <DesignTypes />
                    <AiFeatures />
                    <RecentDesigns />
                </main>
            </div>
            <SubscriptionModal isOpen={showPremiumModal} onClose={setShowPremiumModal} />
            <DesignsModal isOpen={showDesignsModal} onClose={setShowDesignsModal} />
        </div>
    );
}
