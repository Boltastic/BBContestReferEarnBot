/*CMD
  command: /approveWithdraw
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

var adminID = Bot.getProperty("adminID");
if (user.telegramid != adminID) {
  Bot.sendMessage("❌ You are not authorized to approve withdrawals.");
  return;
}

let userId = params.split("_")[1]; // From start param e.g., "approve_123456"
let data = Bot.getProperty("withdraw_" + userId);

if (!data || !data.amount || !data.wallet) {
  Bot.sendMessage("❌ No pending withdrawal for this user.");
  return;
}

// Notify the user
Bot.sendMessageToChatWithId(
  userId,
  "✅ Your withdrawal request has been approved! 🎉\n\n" +
  "💰 Amount: " + data.amount + " INR\n" +
  "💼 Wallet: " + data.wallet + "\n\n" +
  "🎊 Payment sent successfully!"
);

// Optionally: announce reward
Bot.runCommand("/announceReward " + userId);

// Clear the record
Bot.setProperty("withdraw_" + userId, null);

