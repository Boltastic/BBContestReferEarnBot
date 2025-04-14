/*CMD
  command: /saveFeedback
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

// Fix by @NotebookLLM

let feedback = message;
let adminId = "8071014927"; // Replace with admin Telegram ID

Bot.sendMessageToChatWithId(adminId, 
  "📝 *New feedback from* " + user.first_name + ":\n\n" + feedback 
);

Bot.sendMessage("✅ Thank you for your feedback!");

