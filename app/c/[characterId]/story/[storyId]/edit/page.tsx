"use server";

import NewStoryMain from "@/components/story/NewStoryMain";
import { getCurrentUser } from "@/functions/db/auth";
import { getCharacter } from "@/functions/db/character";
import { getStory } from "@/functions/db/stories";
import { Profile } from "@/types/db";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(
    { params: { storyId } } : { params: { storyId: string } }
) : Promise<Metadata> {
    
    try {
        const story = await getStory(storyId);

        return {
            title: `Editing ${story.title}`,
        }
        
    } catch (error) {
        console.error(error);
        return {
            title: `Editing Story`,
        }   
    }

}


export default async function EditStory({ params: { characterId, storyId } }: { params: { characterId: string, storyId: string } }) {

    let profile: Profile | undefined = undefined;
    try {
        profile = await getCurrentUser();
    } catch (e) {
        console.error(e);
        redirect("/");
    }
    const character = await getCharacter(characterId);
    const story = await getStory(storyId);

    return (
        <>
        <div className="flex items-center gap-2">
            <h2 className="font-bold text-2xl">Edit your Story</h2>
        </div>
        
        <NewStoryMain 
            profile={profile} 
            character={character}
            editMode
            story={story}
        /> 
        </>
    )
}