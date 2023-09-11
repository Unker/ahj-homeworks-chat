const chatHistory = {
  users: new Set(),
  messages: [{
    time: 0,
    user: '',
    message: '',
  },],
  listeners: [],
  
  addUser(user) {
    this.users.add(user);
    
    this.listeners.forEach(handler => handler(item));
  },

  removeUser(user) {
    this.users.delete(user);
    
    this.listeners.forEach(handler => handler(item));
  },
  
  listen(handler) {
    this.listeners.push(handler);
  },
}

module.exports = chatHistory;
