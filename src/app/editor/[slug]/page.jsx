"use client";

import MainEditor from "@/components/editor";
import { getUserDesigns } from "@/services/design-service";
import { getUserSubscription } from "@/services/subscription-service";
import { useEditorStore } from "@/store";
import { useEffect } from "react";

const EditorPage = () => {
    const { setUserSubscription, setUserDesigns } = useEditorStore();

    const fetchUserSubscription = async () => {
        const response = await getUserSubscription();
        setUserSubscription(response.data);
    };

    const fetchUserDesigns = async () => {
        const result = await getUserDesigns();
        setUserDesigns(result.data);
    };

    useEffect(() => {
        fetchUserSubscription();
        fetchUserDesigns();
    }, []);

    return <MainEditor />;
};

export default EditorPage;
