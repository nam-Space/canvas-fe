"use client";

import { useEditorStore } from "@/store";
import { useRouter } from "next/navigation";
import DesignPreview from "./design-preview";
import { Loader, Trash2 } from "lucide-react";
import { deleteDesign, getUserDesigns } from "@/services/design-service";

const DesignList = ({ isModalView }) => {
    const router = useRouter();
    const {
        userDesigns,
        setUserDesigns,
        setShowDesignsModal,
        userDesignsLoading,
    } = useEditorStore();

    const dataDesigns = isModalView ? userDesigns : userDesigns.slice(0, 4);

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

    if (userDesignsLoading)
        return (
            <div className="flex justify-center">
                <Loader className="w-[40px] h-[40px]" />
            </div>
        );

    return (
        <div
            className={`${
                isModalView ? "p-4" : ""
            } grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4`}
        >
            {!dataDesigns.length && <h1>No Design Found!</h1>}
            {dataDesigns.map((design) => (
                <div key={design._id} className="group cursor-pointer">
                    <div
                        onClick={() => {
                            router.push(`/editor/${design?._id}`);
                            setShowDesignsModal(false);
                        }}
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
