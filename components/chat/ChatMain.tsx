"use client";

import { useChat, Message as AIMessage } from "ai/react";
import { Textarea } from "@nextui-org/input";
import { v4 as uuidv4 } from "uuid";
import InfiniteScroll from "react-infinite-scroller";

import { Button } from "../utils/Button";
import Icon from "../utils/Icon";

import { Chat, Message, Profile } from "@/types/db";
import { useRef, useState, useEffect } from "react";
import { addMessage, getMessages } from "@/functions/db/messages";
import Messagebubble from "./Messagebubble";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@nextui-org/spinner";


export default function ChatMain({ chat, initMessages, user } : { chat: Chat, initMessages: Message[], user: Profile }) {
    const [cursor, setCursor] = useState(initMessages.length);
    const [canLoadMore, setCanLoadMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    const { messages, setMessages, input, handleInputChange, handleSubmit, addToolResult } = useChat({
        initialMessages: initMessages.map((m) => {
            return {
                id: m.id,
                createdAt: m.created_at,
                content: m.content,
                role: m.from_ai ? 'assistant' : 'user',
                
            } as AIMessage
        }),
        initialInput: "",
        maxSteps: 5,
        keepLastMessageOnError: true,
        body: {
            profile: user,
            chat: chat
        },
        async onToolCall({ toolCall }) {
            console.log("Tool call", toolCall);
        },
        onFinish: async (message, options) => {
            console.log("Finished", message, options);
            scrollToBottom();
            if (inputRef.current) {
                inputRef.current.focus();
            }
            // add message to db
            const newMessage: Message = {
                id: uuidv4(),
                chat: chat,
                character: chat.character,
                user: user,
                from_ai: true,
                content: message.content,
                is_edited: false,
                is_deleted: false,
            }

            // can be a tool call, which should not be added to the db
            // tool calls dont have a content
            if(newMessage.content !== "") {
                const res = await addMessage(newMessage);
                console.log(res);
            }

        }
    });

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const loadMoreMessages = async () => {
        console.log("Loading more messages");
        setIsLoading(true);
        const newMessages = await getMessages({
            chatId: chat.id,
            from: cursor,
            limit: 10
        })

        if(newMessages.length === 0) {
            setCanLoadMore(false);
            return;
        }

        if(newMessages.length < 10) {
            setCanLoadMore(false);
        }

        setCursor(cursor + newMessages.length);

        const revMessages = newMessages.reverse();
        const mappedMessages = revMessages.map((m) => {
            return {
                id: m.id,
                createdAt: m.created_at,
                content: m.content,
                role: m.from_ai ? 'assistant' : 'user',
            } as AIMessage
        })

        setMessages(mappedMessages.concat(messages))
        setIsLoading(false);
    }

    const scrollToBottom = () => {
        const scrollArea = document.querySelector("#scroller > div");
        scrollArea?.scrollTo(0, scrollArea.scrollHeight);
    }

    return (
        <>
        <ScrollArea id="scroller" className="h-screen" >
            <InfiniteScroll 
                isReverse
                id="infinitescroll"
                pageStart={1}
                initialLoad={false}
                loadMore={async () => await loadMoreMessages()}
                hasMore={canLoadMore}
                threshold={50}
                loader={isLoading ? <div className=" w-full flex items-center justify-center py-4 " key={0}><Spinner size="sm" /></div> : <></>}
                useWindow={false}
                getScrollParent={() => document.querySelector("#scroller > div")}
                className="flex flex-col gap-2 pb-40 pt-28 px-4"
            >
                {messages.map((message, index) => (
                    <Messagebubble key={message.id} message={message} index={index} chat={chat} addToolResult={addToolResult} />
                ))}
            </InfiniteScroll>
        </ScrollArea>
 

        <div className="absolute bottom-0 left-0 pb-8 pt-2 px-8 bg-content1/50 backdrop-blur-3xl w-full flex items-center justify-center">
            <form className="w-full" onSubmit={handleSubmit}>
                <Textarea 
                    placeholder="Send a message" 
                    size="lg" 
                    radius="full" 
                    value={input}
                    ref={inputRef}
                    name="prompt"
                    onChange={handleInputChange}
                    minRows={1}
                    maxRows={15}
                    classNames={{
                        inputWrapper: "pr-1 bg-content1/75",
                        innerWrapper: "flex items-center justify-center",
                    }}
                    endContent={
                        <Button className="self-end" type="submit" color="secondary" radius="full" isIconOnly>
                            <Icon filled>send</Icon>
                        </Button>
                    } 
                />
            </form>
        </div>
        </>
    )
}