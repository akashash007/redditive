import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ROUTES from "@/config/routeConfig";
import { fetchFromEndpoint } from "@/services/redditApi";
import { useNotify } from "@/utils/NotificationContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SavedItemsPanel from "@/components/charts/SavedItemsPanel";
import { Loader } from "@/components/loader";
import ShimmerWrapper from "@/components/ui/ShimmerWrapper";

export default function SavedPage() {
    const { data: session, status } = useSession();
    const [savedItems, setSavedItems] = useState([]);
    const [after, setAfter] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const router = useRouter();
    const { notify } = useNotify();

    const fetchSavedItems = async (afterParam = null) => {
        try {
            const res = await fetch(
                `/api/reddit/saved?username=${session.user.name}&accessToken=${session.accessToken}${afterParam ? `&after=${afterParam}` : ""}`
            );
            const json = await res.json();
            const newItems = json?.data?.children || [];

            setSavedItems((prev) => {
                // Prevent duplicates by ID
                const seen = new Set(prev.map((i) => i.data.id));
                const uniqueNew = newItems.filter((i) => !seen.has(i.data.id));
                return [...prev, ...uniqueNew];
            });

            setAfter(json?.data?.after || null);
            setHasMore(!!json?.data?.after);
        } catch (err) {
            notify("error", "Fetch Error", "Could not load saved items.");
            console.error(err);
        }
    };

    useEffect(() => {
        if (status !== "authenticated" || !session?.accessToken) return;

        let hasFetched = false;

        if (!hasFetched) {
            setIsInitialLoading(true);
            fetchSavedItems().finally(() => setIsInitialLoading(false));
            hasFetched = true;
        }
    }, [status, session?.accessToken]);

    const loadMore = async () => {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        await fetchSavedItems(after);
        setIsLoadingMore(false);
    };

    if (status === "loading" || isInitialLoading) {
        return <Loader />;
    }

    return (
        <DashboardLayout>
            <ShimmerWrapper
                // loading={commentsLoading}
                fallbackHeight={600}     // matches ~ h-80 zone
                baseColor="#3b0764"
                highlightColor="#c084fc"
                duration={1400}
                direction="rtl"
                lockHeightWhileLoading
            >
                <SavedItemsPanel
                    savedItems={savedItems}
                    loadMore={loadMore}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                />
            </ShimmerWrapper>
        </DashboardLayout>
    );
}
