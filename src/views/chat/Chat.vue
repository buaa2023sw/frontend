<script>


export default {
    name: "Chat",

    data() {
        return {
            selectedRoom: 0,
            messageInput: '',
            chatRooms: [],
        }
    },
    created() {
        // this.initWS(1)
        this.updateChatRooms()
    },
    inject: {
        user: {default: null}
    },
    methods: {
        updateChatRooms() {
            console.log('updating chat rooms...')
            // 保存现有的ws
            let tempWS = {}
            this.chatRooms.forEach((item, index) => {
              if (item.ws !== null) {
                tempWS[item.id] = item.ws
              }
            })

            // 调用API更新chatRooms
            this.chatRooms = [
              {
                id: 1,
                title: "room1",
                history: []
              }
            ]

            // 重新分配ws
            this.chatRooms.forEach((item, index) => {
                if (tempWS[item.id] !== undefined) {
                    item.ws = tempWS[item.id]
                    tempWS[item.id] = undefined
                } else {
                    item.ws = this.initWS(item.id)
                }
            })

            // 关闭多余的ws
            for (const [key, value] of Object.entries(tempWS)) {
                value.close()
            }
        },
        initWS(rid) {
          console.log('initWS: connecting to ws://104.208.78.33:8000/ws/chat/' + this.user.id.toString() + '/' + rid.toString())
          const socket = new WebSocket('ws://104.208.78.33:8000/ws/chat/' + this.user.id.toString() + '/' + rid.toString());

          const onopen = (e) => {
            socket.send(JSON.stringify({
              sender: this.user.id,
              type: 1,
              message: this.user.name + ' has joined the group chat!'
            }))
          }

          socket.onopen = onopen

          const onmessage = (fromName, fromId, content, time) => {
            // console.log(fromName, fromId, content, time)
            this.chatRooms[this.selectedRoom].history.push({
              from: fromName,
              type: 'group',
              content: content,
              time: time
            })

          }

          socket.onmessage = function (event) {
            console.log('Message from server ', event.data);
            var data = JSON.parse(event.data)
            onmessage(data.senderName, data.senderId, data.content, data.time)
          };

          socket.onerror = function (event) {
            console.error('WebSocket error observed:', event)
          }

          socket.onclose = function (e) {
            console.log('Socket is closed.', e.reason);
          }

          return socket
        },
        sendMsg() {
            console.log('will send: ' + this.messageInput)
            this.chatRooms[this.selectedRoom].ws.send(JSON.stringify({
                sender: this.user.id,
                type: 1,
                message: this.messageInput
            }));
            this.messageInput = ''
        },
        // addMsg(fromName, fromId, content, time) {
        //     this.chatRooms[this.selectedRoom].history.add({
        //       from: fromName,
        //       type: 'group',
        //       content: content,
        //       time: time
        //     })
        // }
    }
}
</script>

<template>
<v-container fluid>
    <h1>聊天室</h1>
<!--    <span>{{chatRooms}}</span>-->
    <v-row>
        <v-col cols="4">
            <p>selected room: {{ selectedRoom }}</p>
<!--            <div class="red"> left </div>-->
            <v-list>
                <v-list-item-group v-model="selectedRoom" mandatory>
                    <v-list-item v-for="item in chatRooms" :key="item.id">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{item.history.length === 0 ? '还没有消息哦' : item.history[item.history.length-1].content}}</v-list-item-subtitle>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-col>

        <v-col cols="8">
<!--            <div class="blue"> right </div>-->
            <v-row>
                <v-col cols="12">
                  <v-card>
                      <v-card-title class="v-app-bar-title">{{ chatRooms[selectedRoom].title }}</v-card-title>
                      <v-card-subtitle>
                        <v-icon v-if="this.chatRooms[this.selectedRoom].ws.readyState === 1" class="green--text">mdi-circle</v-icon>
                        <v-icon v-else class="yellow--text">mdi-circle</v-icon>
                        ws://104.208.78.33:8000/ws/chat/11/1
                      </v-card-subtitle>

                  </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-text>
                            <v-list min-height="600" max-height="600" class="overflow-auto scroll-y">
                                <v-list-item-group>
                                    <v-list-item v-for="item in chatRooms[selectedRoom].history" :key="item.id">
                                        <v-list-item-title>{{ item.from }} : {{ item.content }}</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="10">
                    <v-text-field label="输入消息" v-model="messageInput"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-btn block @click="sendMsg">SEND</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>