"use client";

import { useEditorStore } from "@/store";
import { useRouter } from "next/navigation";
import DesignPreview from "./design-preview";
import { Trash2 } from "lucide-react";
import { deleteDesign, getUserDesigns } from "@/services/design-service";

const DesignList = () => {
    const router = useRouter();
    const { userDesigns, setUserDesigns } = useEditorStore();

    const fetchUserDesigns = async () => {
        const result = await getUserDesigns();
        setUserDesigns(result.data);
    };

    const handleDeleteDesign = async (id) => {
        const res = await deleteDesign(id);

        if (res.success) {
            fetchUserDesigns();
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {!userDesigns.length && <h1>No Design Found!</h1>}
            {userDesigns.map((design) => (
                <div key={design._id} className="group cursor-pointer">
                    <div
                        onClick={() => router.push(`/editor/${design?._id}`)}
                        className="h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md"
                    >
                        {design?.canvasData && (
                            <DesignPreview design={design} />
                        )}
                    </div>
                    <div className="flex justify-between">
                        <p className="font-bold text-sm truncate">
                            {design.name}
                        </p>
                        <Trash2
                            onClick={() => handleDeleteDesign(design?._id)}
                            className="w-5 h-5 text-red-500"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DesignList;
