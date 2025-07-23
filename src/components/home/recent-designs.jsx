"use client";

import { getUserDesigns } from "@/services/design-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DesignPreview from "./design-preview";

const RecentDesigns = () => {
    const router = useRouter();
    const [userDesigns, setUserDesigns] = useState([]);

    const fetchUserDesigns = async () => {
        const result = await getUserDesigns();
        setUserDesigns(result.data);
    };

    useEffect(() => {
        fetchUserDesigns();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Recent Designs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {!userDesigns.length && <h1>No Design Found!</h1>}
                {userDesigns.map((design) => (
                    <div
                        key={design._id}
                        onClick={() => router.push(`/editor/${design?._id}`)}
                        className="group cursor-pointer"
                    >
                        <div className="w-[300px] h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md">
                            {design?.canvasData && (
                                <DesignPreview design={design} />
                            )}
                        </div>
                        <p className="font-bold text-sm truncate">
                            {design.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentDesigns;
