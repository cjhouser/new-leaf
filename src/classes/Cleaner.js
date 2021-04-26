const Routines = require("../routines.js");
const BadWords = require("bad-words");

class Cleaner {
  /**
   * Each instance handles a single clean execution.
   * cleanCalls tracks the number of recursive calls generated by the
   * request in order to determine when the cleaning is complete.
   * @param {Message} initialMessage The message where cleaning begins.
   */
  constructor(initialMessage) {
    this.rules = new BadWords();
    this.initialMessage = initialMessage;
  }

  async start() {
    var options = { limit: 100 };
    var message = this.initialMessage;
    while (message) {
      options.before = message.id;
      try {
        var messages = await message.channel.messages.fetch(options);
        messages.filter(m => this.rules.isProfane(m.content)).forEach(m => m.delete());
      }
      catch (err) { console.log(err) }
      message = messages.last();
    }
  }
}

module.exports = Cleaner;
