import React from "react";
import { Comment } from "antd";

interface Props {
  data: {
    getChat: {
      messages: any[]
    }
  },
  chatId: string, 
  subscribeToChatUpdates: (chatId: string) => {}
}

export class ChatMessagesList extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.chatId !== prevProps.chatId) {
      this.props.subscribeToChatUpdates(this.props.chatId);
    }
  }
  componentWillUnmount() {
    this.props.subscribeToChatUpdates(this.props.chatId);
  }
  render() {
      if (this.props.data.getChat) {
        const messages = this.props.data.getChat.messages
        console.log('messages', messages)
        return messages.map((message:any) => {
              return <Comment key={message.id}
                author={<p>{message.author.nick}</p>}
                content={<p>{message.text}</p>}
                datetime={
                    <span>{message.timestamp}</span>
                }
              />
            })
      }
      return <div>loading..</div>  
  }
}