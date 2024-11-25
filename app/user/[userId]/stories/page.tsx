"use server";

import StoryCard from "@/components/story/StoryCard";
import { getStories } from "@/functions/db/stories";
import InfiniteListLoader from "@/components/InfiniteListLoader";

export default async function UserStories({ params: {  } } : { params: { userId: string } }) {

    const stories = await getStories(0, 5);

    return (
        <>
        <div className="flex flex-col gap-4 px-4 py-6 pb-20 h-full w-full">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="text-4xl font-bold">Your Stories</h1>
                    <p>You can add new ones on Character pages</p>
                </div>

            </div>
            
            <InfiniteListLoader
                loadMore={getStories}
                limit={5}
                initialData={stories}
                component={StoryCard}
                componentProps={{
                    hasLink: true,
                    fullWidth: true,
                }}
            />

        </div>
        </>
    )
}