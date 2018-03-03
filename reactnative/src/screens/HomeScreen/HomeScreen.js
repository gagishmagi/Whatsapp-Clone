import React, { Component } from 'react';
import { AsyncStorage, Alert, ActivityIndicator, ScrollView, View } from 'react-native';
import { Container, Header, Title, Content, List, 
   Body, Right, Tabs, Tab } from 'native-base';
//import SocketIOClient from 'socket.io-client';
import MorePopupMenu from '../../components/MorePopupMenu';
import { getUserFromId, getLastMessages } from '../../chatsappapi';
import ChatDetails from '../../components/ChatDetails';
import Contacts from '../Contacts';

const defaultimg = 'https://filestore.crawfish92.hasura-app.io/v1/file/61316c53-6640-4d9a-a586-3a9c1892716d';
// for defective95 const defaultimg = 'https://filestore.defective95.hasura-app.io/v1/file/c6afa506-673c-46b0-bf93-50ed2f18163e';
// const image1 = require('../../images/kingfisher.jpg');
// const image2 = require('../../images/butterfly.jpg');
// const image3 = require('../../images/mushrooms.jpg');
//const USER = 'user';


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessages: [],
      isLoading: true,
      user: null,
      fabActive: true,
      mobilenumber: '',
    };
    
    this.onReceivedUserMessages = this.onReceivedUserMessages.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    //this.joinUser = this.joinUser.bind(this);
  
    //this.socket = SocketIOClient('http://localhost:3000');
    //this.socket.on('getUserMessages', this.onReceivedUserMessages);
   
   
   // this.joinUser();
  }
  

  componentWillMount() {
    //this.setUserInfo();
    this.onReceivedUserMessages();
  }

 // Event listeners
  /**
   * When the server sends a message to this.
   */
  //onReceivedUserMessages(userMessages) {
    onReceivedUserMessages = async () => {
      const messages = [
        // {
        //   displayname: 'chinmoyeee',
        //   displaypic: defaultimg,
        //   status: 'Chatsapp!!',
        //     recd_time: 'February 14, 2018 23:16:30 GMT+11:00',
        //     user_id: 1,
        //     msg_text: 'hello',
        //     msg_id: 1,
        //     receiver_id: 2,
        //     sent_time: 'February 14, 2018 23:16:30 GMT+11:00',
        //     sender_id: 1
        // },
        // {
        //   displayname: 'test',
        //   displaypic: defaultimg,
        //     recd_time: 'February 14, 2018 23:20:30 GMT+11:00',
        //     user_id: 2,
        //     status: 'Chatsapp only',
        //     msg_text: 'how r u',
        //     msg_id: 2,
        //     receiver_id: 2,
        //     sent_time: 'February 14, 2018 23:20:30 GMT+11:00',
        //     sender_id: 1
        // },
        // {
        //   displayname: 'Sam',
        //   displaypic: defaultimg,
        //   status: 'I like Chatsapp',
        //     recd_time: 'February 14, 2018 23:25:40 GMT+11:00',
        //     user_id: 3,
        //     msg_text: 'I am fine.. busy!!',
        //     msg_id: 3,
        //     receiver_id: 1,
        //     sent_time: 'February 14, 2018 23:25:30 GMT+11:00',
        //     sender_id: 2
        // }
    ];
    const user_id = await AsyncStorage.getItem('user_id');
    const newmessages = await getLastMessages(user_id);
    //skipping first row 
    for (let i = 1; i < newmessages.result.length; i++) {
      const friend_id=newmessages.result[i][2];
      const friends = await getUserFromId(friend_id);
      const friend = friends[0];
      console.log(friend);
      messages.push({
        user_id: user_id,
        friend_id: friend_id,
        displayname: friend.displayname,
        displaypic: defaultimg,
        status: friend.status,
        msg_id: newmessages.result[i][1],
        msg_text: newmessages.result[i][3],
        sent_time: newmessages.result[i][4],
        recd_time: newmessages.result[i][5] 
    });
    }
    console.log(messages);

    this.setState({ user_id, isLoading: false, userMessages: messages });
 }

  setUserInfo = async () => {
    console.log('setting user info');
    AsyncStorage.getItem('user_id')
    .then(res => { 
      this.setState({ user_id: res });
      console.log(this.state.user_id);
      
      return getUserFromId(this.state.user_id);
    }).then(user => {
      console.log(user);
      console.log(JSON.stringify(user[0]));
      this.state.user = JSON.stringify(user[0]);
      AsyncStorage.setItem('user', JSON.stringify(user[0]));
      console.log(user[0].user_id);
    })
    .catch(error => console.log(error));
  }
    
  // joinUser() {
  //   AsyncStorage.getItem('user')
  //     .then(req => JSON.parse(req))
  //     .then(json => { 
  //       this.state.user = json; 
  //       console.log(`inside joinuser, state ${JSON.stringify(this.state.user)}`); 
  //     })
  //     .catch(error => console.log(error));
      //console.log(user.displayname);
     
    // const user = AsyncStorage.getItem(USER_ID);
    // console.log(user);
      // .then((userid) => {
      //   // If there isn't a stored userId, then fetch one from the server.
      //   if (!userid) {
      //     this.socket.emit('userJoined', null);
      //     this.socket.on('userJoined', (userid) => {
      //       AsyncStorage.setItem(USER_ID, userid);
      //       this.setState({ userid });
      //     });
      //   } else {
      //     this.socket.emit('userJoined', userid);
      //     this.setState({ userid });
      //   }
      // })
      // .catch((e) => Alert.alert('Error', `Error in getting User Info  ${e}`));
 // }

renderContacts() {
  //console.log(`inside renderContacts, state ${this.state.userMessages}`);
  //album passed as prop from parent to child so that the particular album's detail is shown
  return (
    <Contacts user_id={this.state.user_id} navigation={this.props.navigation} />
  );
  }
renderChats() {
  console.log(`inside renderChats, state ${this.state.userMessages.toString}`);
  //album passed as prop from parent to child so that the particular album's detail is shown
  return this.state.userMessages.map(userMessages =>
      <ChatDetails key={userMessages.msg_id} userMessages={userMessages} navigation={this.props.navigation} />);
}
render() { 
      if (this.state.isLoading) {
      return (

        <View style={{ flex: 1, paddingTop: 20 }} >
          <ActivityIndicator />
        </View>
      );
    }
    const { navigate } = this.props.navigation;
    return (
      <Container>
      <Header style={{ backgroundColor: '#045e54' }}>
         <Body>
         <Title>ChatsApp</Title>
       </Body>
       <Right>
         { console.log(this.state.user) }
         <MorePopupMenu onPress={() => navigate('Profile', { user: this.state.user })} actions={['Settings']} />
      </Right>
      </Header>
      <Content>
      <Tabs initialPage={0} tabBarUnderlineStyle={{ borderBottomWidth: 1 }}>
          <Tab heading="Chats" tabStyle={{ backgroundColor: '#045e54' }} activeTabStyle={{ backgroundColor: '#045e54' }}>
            <List style={{ backgroundColor: 'white' }}>
            {this.renderChats()}
            </List>
          </Tab>
          <Tab heading="Contacts" tabStyle={{ backgroundColor: '#045e54' }} activeTabStyle={{ backgroundColor: '#045e54' }}>
          <List style={{ backgroundColor: 'white' }}>
            {this.renderContacts()}
            </List>
          </Tab>
        </Tabs>
     
          
      </Content>
      
    </Container>
    );
  } 
}
