import React from "react";
import { Chat } from "../../../../typings/types";
import { Card } from "antd";
import { DeleteChatButton } from "../DeleteChatButton/DeleteChatButton";

interface Props {
  chats: Chat[]
  subscribeToChatsUpdates: () => {}
  handleOpenChat: (chat: any) => void
}

export class ChatsList extends React.Component<Props> {
  
  componentDidMount() {
    this.props.subscribeToChatsUpdates();
  }

  render() {
    if (this.props.chats) {
      return this.props.chats.map((item: Chat) => 
        <div key={item.id} onClick={() => this.props.handleOpenChat(item)}>
            <Card title={item.title} size="small" extra={<DeleteChatButton id={item.id} ></DeleteChatButton>}>
              <p>{item.lastMessage ? item.lastMessage.text : ''}</p>
            </Card>
        </div>
      );
    } else {
      return <div>Loading...</div>
    }
  }
}