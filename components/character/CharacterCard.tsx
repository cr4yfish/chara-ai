"use client";

import { motion } from "motion/react";
import Image from "next/image"
import { Card, CardBody } from "@nextui-org/card";
import { Character } from "@/types/db";
import Icon from "../utils/Icon";
import ConditionalLink from "../utils/ConditionalLink";
import { truncateText } from "@/lib/utils";

type Props = {
    character: Character,
    hasLink: boolean,
    fullWidth?: boolean,
    isSmall?: boolean,
    noBg?: boolean
}

export default function CharacterCard(props: Props) {

    return (
        <>
        <ConditionalLink active={props.hasLink} href={`/c/${props.character.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <Card 
                    isPressable={props.hasLink} 
                    className={`
                        h-[150px] w-[300px dark:bg-zinc-800/40 backdrop-blur-xl border-none shadow-none
                        ${props.fullWidth && "w-full"} 
                        ${props.isSmall && "h-full"}
                        ${props.noBg && "dark:bg-transparent"} 
                    `}>
                    <CardBody className="flex flex-row gap-4">
                        
                        <div className="flex items-center justify-center">
                            <div className="relative h-[100%] w-[100px] overflow-hidden rounded-2xl">
                                <Image className="relative object-cover" layout="fill" src={props.character.image_link ?? ""} alt={props.character.name} />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-col">
                                    <div className="flex flex-col">
                                        <h3 className="font-medium">{truncateText(props.character.name,40)}</h3>
                                        
                                    </div>
                                    <p className=" text-sm dark:text-zinc-400">By @{props.character.owner?.username}</p>
                                </div>
                                <p className="text-xs">{truncateText(props.character.description,40)}</p> 
                            </div>
                            {!props.isSmall &&
                            <div className="flex flex-row items-center gap-2 text-xs dark:text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Icon downscale filled>chat_bubble</Icon>
                                    30.0m
                                </span>
                                <span className="flex items-center gap-1">
                                    <Icon downscale filled>account_circle</Icon>
                                    {props.character.owner?.username}
                                </span>
                            </div>}
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </ConditionalLink>
        </>
    )
}