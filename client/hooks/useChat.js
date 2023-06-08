import React from 'react';
import { Actions } from '../socket';

export default function useChat(socket) {
    const [messages, setMessages] = React.useState([]);

    const appendMessage = React.useCallback((message) => {
        socket.emit(Actions.CHAT_MESSAGE, message);
    }, [messages]);


    React.useEffect(() => {
        const messages = [];
        socket.on(Actions.CHAT_MESSAGE, async ({sid, nickname, message }) => {
            messages.push([nickname, message]);
            setMessages([...messages]);
        });
    }, [socket]);

    return [messages, appendMessage];
}