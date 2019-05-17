import React from "react";
import { Chat } from "../../../../typings/types";
import { Card } from "antd";
import { DeleteChatButton } from "../DeleteChatButton/DeleteChatButton";

interface Props {
  chats: Chat[]
  subscribeToChatUpdates: () => {}
}

export class ChatsList extends React.Component<Props> {
  
  componentDidMount() {
    this.props.subscribeToChatUpdates();
  }

  render() {
    if (this.props.chats) {
      return this.props.chats.map((item: Chat) => 
        <div key={item.id} onClick={() => console.log('open chat')}>
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