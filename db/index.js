const chatUsers = {
  users: new Set(['testUser']),
  listeners: [],
  
  add(user) {  
    this.users.add(user);
    
    // this.listeners.forEach(handler => handler(user, true));
    this.listeners.forEach(handler => handler(this.users));
  },

  remove(user) {
    this.users.delete(user);
    
    this.listeners.forEach(handler => handler(this.users));
  },
  
  listen(handler) {
    this.listeners.push(handler);
  },
}

const chatHistory = {
  messages: [
    {
      time: 123,
      user: 'un',
      message: 'qqqqq',
    },
    {
      time: 123333,
      user: '111',
      message: 'zxc',
    },
  ],
  listeners: [],
  
  add(user, message) {
    const d = new Date();
    const n = d.toLocaleTimeString();
    const item = {
      time: n,
      user,
      message,
    };
    this.messages.append(item);
    
    this.listeners.forEach(handler => handler(item));
  },
  
  listen(handler) {
    this.listeners.push(handler);
  },
  
}

module.exports = { chatUsers, chatHistory };
