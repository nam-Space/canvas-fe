"use client";

import { Crown, Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { saveDesign } from "@/services/design-service";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/store";
import { MAX_FREE_DESIGNS } from "@/constants/limit";
import { toast } from "sonner";

const Banner = () => {
    const { userDesigns, userSubscription } = useEditorStore();

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreateNewDesign = async () => {
        if (
            userDesigns?.length > MAX_FREE_DESIGNS &&
            !userSubscription?.isPremium
        ) {
            toast.error("Please upgrade to premium!", {
                description:
                    "You need to upgrade to premium to create more designs",
            });
            return;
        }
        if (loading) return;
        try {
            setLoading(true);

            const initialDesignData = {
                name: "Untitled design - Youtube Thumbnail",
                cavasData: null,
                width: 825,
                height: 465,
                category: "youtube_thumbnail",
            };

            const newDesign = await saveDesign(initialDesignData);

            if (newDesign?.success) {
                router.push(`/editor/${newDesign?.data?._id}`);
            } else {
                throw new Error("Failed to create new design");
            }
        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    };

    return (
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] text-white p-4 sm:p-6 md:p-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-300" />
                <span className="sm:ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                    Create Innovative Designs
                </span>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 max-w-2xl mx-auto">
                Design eye-catching thumbnails that get more views
            </h2>
            <Button
                onClick={handleCreateNewDesign}
                className={
                    "text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 cursor-pointer"
                }
            >
                {loading && <Loader className="w-4 h-4" />}
                Start Desiging
            </Button>
        </div>
    );
};

export default Banner;
