"use server";

import CharacterCard from "@/components/character/CharacterCard";
import { Button } from "@/components/utils/Button";
import { getCharacters } from "@/functions/db/character";
import { Character } from "@/types/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

export default async function Home() {

  let characters: Character[] = [];

  try {
    characters = await getCharacters();
  } catch (error) {
    console.error(error);
    redirect("/error");
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col gap-4 px-4 py-6">
      <h1 className="text-4xl font-bold">Charai</h1>
      <Link href={"/c/new"}><Button color="primary" variant="shadow">New Character</Button></Link>

      <div className="flex flex-col gap-2">
        <h2 className="dark:prose-invert text-xl font-bold">Popular</h2>
        <ScrollShadow orientation={"horizontal"} className="overflow-x-auto">
          <div className="w-fit flex flex-row gap-4 pr-10 pb-4">
            {characters.map((character) => (
              <CharacterCard hasLink key={character.id} character={character} />
            ))}
          </div>
        </ScrollShadow>
      </div>


      <div className="flex flex-col gap-2">
        <h2 className="dark:prose-invert text-xl font-bold">New</h2>
        <ScrollShadow orientation={"horizontal"} className="overflow-x-auto">
          <div className="w-fit flex flex-row gap-4 pr-10 pb-4">
            {characters.map((character) => (
              <CharacterCard hasLink key={character.id} character={character} />
            ))}
          </div>
        </ScrollShadow>
      </div>


    </div>
  );
}
