import React from 'react';

export default function useChat(props) {
    const [messages, setMessages] = React.useState([]);

    const appendMessage = React.useCallback((message) => {
        messages.push(message);
        setMessages(messages);
    }, [messages]);

    return [messages, appendMessage];
}