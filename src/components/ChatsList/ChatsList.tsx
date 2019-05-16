import React from "react";
import { Chat } from "../../../../typings/types";
import { Card } from "antd";

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
        <div key={item.id} style={{height: 80}} onClick={() => console.log('open')}>
            <Card title={item.title} size="small">
                <p>{item.lastMessage ? item.lastMessage.text : ''}</p>
            </Card>
        </div>
      );
    } else {
      return <div>Loading...</div>
    }
  }
}