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

function getDate() {
  const currentDate = new Date();

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = currentDate.getFullYear();

  return `${hours}:${minutes} ${day}:${month}:${year}`;

}

const chatHistory = {
  messages: [
    {
      time: getDate(),
      user: 'user1',
      message: 'test msg',
    },
    {
      time: getDate(),
      user: 'user2',
      message: 'I am alive',
    },
  ],
  listeners: [],

  add(user, message) {
    const item = {
      time: getDate(),
      user,
      message,
    };
    this.messages.push(item);

    this.listeners.forEach(handler => handler(item));
  },

  listen(handler) {
    this.listeners.push(handler);
  },

}

module.exports = { chatUsers, chatHistory };
