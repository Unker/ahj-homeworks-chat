const chatUsers = {
  users: new Map([
    [123, 'testUser'],
  ]),
  listeners: [],

  add(uuid, user) {
    this.users.set(uuid, user);

    this.listeners.forEach(handler => handler([...chatUsers.users.values()]));
  },

  remove(uuid) {
    this.users.delete(uuid);

    this.listeners.forEach(handler => handler([...chatUsers.users.values()]));
  },

  isIncludeUser(user) {
    for (const [key, mapValue] of this.users.entries()) {
      if (mapValue === user) {
        return true; // Значение найдено в коллекции
      }
    }
    return false; 
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
