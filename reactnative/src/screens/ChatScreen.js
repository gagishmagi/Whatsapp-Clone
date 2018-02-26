import React, { Component } from 'react';
import {
  Keyboard, TextInput, StyleSheet, AsyncStorage
} from 'react-native';
import { Container, Header, Content, Item, Input, Left, Right, Button, Body, Thumbnail, Title, View, Icon } from 'native-base';
import SocketIOClient from 'socket.io-client';
import MessageBubble from '../components/MessageBubble';


const { EmojiOverlay } = require('react-native-emoji-picker');

let user;
const image = require('../images/kingfisher.jpg');

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user,
      user_id: this.props.navigation.state.params.user_id,
      friendid: this.props.navigation.state.params.friend_id,
      showPicker: false,
      messages: [],
      value: '',
      height: 40
    };
    this.joinUser = this.joinUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    
    this.socket = SocketIOClient('http://app.course77.hasura-app.io/');
    this.socket.on('message', this.onReceivedMessage);

    this.joinUser();
    console.log(this.props.navigation.state.params.user_id, this.props.navigation.state.params.friend_id);
    this.sendMessage.bind(this);
    
  // const messages = [
  //   {
  //       recd_time: 'February 14, 2018 23:16:30 GMT+11:00',
  //       user_mobilenumber: 9283498234,
  //       msg_text: 'hello',
  //       msg_id: 1,
  //       receiver_id: 2,
  //       sent_time: 'February 14, 2018 23:16:30 GMT+11:00',
  //       sender_id: 1
  //   },
  //   {
  //       recd_time: 'February 14, 2018 23:20:30 GMT+11:00',
  //       user_mobilenumber: 9283498234,
  //       msg_text: 'how r u',
  //       msg_id: 2,
  //       receiver_id: 2,
  //       sent_time: 'February 14, 2018 23:20:30 GMT+11:00',
  //       sender_id: 1
  //   },
  //   {
  //       recd_time: 'February 14, 2018 23:25:40 GMT+11:00',
  //       user_mobilenumber: 9888888888,
  //       msg_text: 'I am fine.. busy!!',
  //       msg_id: 3,
  //       receiver_id: 1,
  //       sent_time: 'February 14, 2018 23:25:30 GMT+11:00',
  //       sender_id: 2
  //   }
//];
  }

  onReceivedMessage = (msg) => {
    console.log(msg);
  }

  joinUser() {
    AsyncStorage.getItem('user')
      .then(req => JSON.parse(req))
      .then(json => { 
        this.state.user = json; 
        console.log(`inside joinuser, state ${JSON.stringify(this.state.user)}`); 
      })
      .catch(error => console.log(error));
      this.socket.on('connect', () =>  {
        console.log('in CONNECT');
    //		socket.send('User has connected');
     		const userid = this.state.user_id;
     //   let tp_from_mobile = decodeURIComponent(window.location.search.match(/(\?|&)mobile\=([^&]*)/)[2]);
        this.socket.emit('myConnect', {
          msg: 'User has connected',
          fromMobile: userid
        });
      });
  }

  updateSize = (height) => {
    console.log(height);
    this.setState({
      height
    });
  }
 
  sendMessage(msgValue) {
    console.log(this.state.value);
    console.log('MS=', msgValue, 'from :', this.state.user_id, 'to:', this.state.friend_id);
		this.socket.emit('myMessage', {
			msg: msgValue,
			fromMobile: this.state.user_id,
			toMobile: this.state.friend_id,
    });
    
		console.log('emitted my message');
    this.state.messages.push({
      recd_time: null,
      user_mobilenumber: user.mobilenumber,
      msg_text: msgValue,
      // need not pass msgid for db
      msg_id: 4,
      receiver_id: this.state.friend_id,
      sent_time: new Date(),
      sender_id: this.state.user_id
  });

    this.setState({
      messages: this.state.messages,
      value: ''
  });
}

openEmoji() {
  Keyboard.dismiss();
  this.setState({ showPicker: true });
}

handlePick(emoji) {  
  const { value } = this.state;
  this.setState({ value: value + emoji });
  console.log(emoji);
 // this.setState({ value: value + emoji });
}

render() {
    const { value, height } = this.state;
    const { navigate } = this.props.navigation;
    const newStyle = {
      flex: 1,
      height
    };

    const messages = this.state.messages;
       
    return (
      <Container style={{ backgroundColor: '#fbebb0' }}>
       
        <Header style={{ backgroundColor: '#045e54' }}>
        <Left>   
        <Button
          transparent
          onPress={() => navigate('ImageScreen', { dp: image })}
        >         
          <Thumbnail source={image} small />
        </Button>
        </Left>
            <Body>
            {/* <Button
              transparent
              onPress={() => navigate('Contact')} 
            >    */}
            <Title onPress={() => navigate('Contact')}>Chinmoyee </Title>
            {/* </Button> */}
          </Body>
          {/* <Right>
            <Button transparent onPress={() => navigate('Login')}>
              <Icon name='more' />
            </Button>
          </Right> */}
          </Header>
        <Content >
         {/* <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
                    {messages}
         </ScrollView> */}
         
         <View style={{ flex: 1 }}>
         {messages.map((message) => 
         <MessageBubble key={message.time} userid={message.userid} text={message.text} time={message.time} />
         )}
         {/* <MessageBubble key={0} direction='left' text='hello' />
         <MessageBubble key={1} direction='left' text='hw r u? ' />
         <MessageBubble key={2} direction='right' text='i am fine ' /> */}
         </View>
         
         </Content> 
         <View style={styles.inputBar}>
         <Button transparent onPress={this.openEmoji.bind(this, value)}>
           <Icon name='flower' active style={{ color: '#045e54' }} />
        </Button>
         <TextInput
        placeholder="Type a message"
        onChangeText={(value) => this.setState({ value })}
        style={{ borderRadius: 10,
backgroundColor: 'white',
borderWidth: 1,
borderColor: 'gray',
flex: 1, 
        fontSize: 16,
paddingHorizontal: 10,
height }}
        editable
        multiline
        value={value}
        onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
        onSubmitEditing={Keyboard.dismiss}
         />
         {/* <Item rounded>
            <Input 
            placeholder='Type a message'
            onChangeText={(value) => this.setState({ value })}
            multiline
            style={{ backgroundColor: 'white', fontSize: 16, height, flex: 1 }}
            value={value}
           onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
            />
          </Item> */}
          <Button transparent onPress={this.sendMessage.bind(this, value)}>
           <Icon name='send' active style={{ color: '#045e54' }} />
        </Button>
          
          </View>
         
          <EmojiOverlay
            style={{
              height: 200,
              backgroundColor: '#f4f4f4',
              padding: 5
            }}
            horizontal
            visible={this.state.showPicker}
            onEmojiSelected={this.handlePick.bind(this)}
            onTapOutside={() => this.setState({ showPicker: false })} 
          />
         
          {/* <View style={styles.inputBar}>
        <TextInput
        placeholder="Type a message"
        onChangeText={(value) => this.setState({ value })}
        style={{ borderRadius: 5, borderWidth: 1, borderColor: 'gray', flex: 1, 
        fontSize: 16, paddingHorizontal: 10, height }}
        editable
        multiline
        value={value}
        onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
        />  </View>
       */}
       
      </Container>
    );
  }
  
}


//The bar at the bottom with a textbox and a send button.
// class InputBar extends Component {

//   //AutogrowInput doesn't change its size when the text is changed from the outside.
//   //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
//   //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
//   //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
//   //of the InputBar's text to be set from the outside.

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.text === '') {
//       this.autogrowInput.resetInputText();
//     }
//   }

//   render() {
//     return (
//           <View style={styles.inputBar}>
//             <AutogrowInput style={styles.textBox}
//                         ref={(ref) => { this.autogrowInput = ref }} 
//                         multiline={true}
//                         defaultHeight={30}
//                         onChangeText={(text) => this.props.onChangeText(text)}
//                         onContentSizeChange={this.props.onSizeChange}
//                         value={this.props.text}/>
//             <TouchableHighlight style={styles.sendButton} onPress={() => this.props.onSendPressed()}>
//                 <Text style={{color: 'white'}}>Send</Text>
//             </TouchableHighlight>
//           </View> 
//           );
//   }
// }

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  
});
