/*CMD
  command: 📤 Withdraw
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: *Enter The Amount You Want To Withdraw*

  <<KEYBOARD

  KEYBOARD
  aliases: /withdraw
  group: 
CMD*/

var maxwith = 100000000000000000000;
var minwith = 10;
var channel = "-1002511481346"; // Admin Channel ID
var stat = Bot.getProperty("" + user.telegramid + "?Ban");

if (stat == "ban") {
  Bot.sendMessage("*❌ You are banned from using this bot!*");
  return;
}

var payouts = Libs.ResourcesLib.anotherChatRes("payouts", "global");
var wallet = User.getProperty("wallet");
var balance = Libs.ResourcesLib.userRes("balance");

if (!wallet) {
  Bot.sendMessage("❌ Please set your wallet first.");
  return;
}

if (!message || isNaN(message)) {
  Bot.sendMessage("❌ Please enter a valid numeric amount.");
  return;
}

message = parseFloat(message);

if (message < minwith) {
  Bot.sendMessage("❌ Minimum withdrawal amount is " + minwith + " INR.");
  return;
}
if (message > maxwith) {
  Bot.sendMessage("❌ Maximum withdrawal amount is " + maxwith + " INR.");
  return;
}
if (message > balance.value()) {
  Bot.sendMessage("❌ Insufficient balance. Your balance is " + balance.value().toFixed(2) + " INR.");
  return;
}

// Deduct balance and update payout stats
balance.remove(message);
payouts.add(message);

// Store transaction history
var claimhistory = User.getProperty("claimhistory", []);
if (!claimhistory) claimhistory = [];

var transactionRecord =
  "📤 <b>Withdrawal</b>: <code>" +
  message +
  " INR</code> | 🏦 <b>Wallet:</b> <code>" +
  wallet +
  "</code> | 📅 " +
  new Date().toLocaleString();

claimhistory.unshift(transactionRecord);
if (claimhistory.length > 20) {
  claimhistory.pop();
}
User.setProperty("claimhistory", claimhistory, "json");

// Store withdrawal globally for approval
Bot.setProperty("withdraw_" + user.telegramid, {
  amount: message,
  wallet: wallet,
  name: user.first_name
}, "json");

// Notify user
Bot.sendMessage(
  "*✅ Withdrawal Requested Successfully!*\n\n" +
  "💰 Amount: " + message + " INR\n" +
  "💼 Wallet: " + wallet + "\n\n" +
  "⏳ Please wait up to 12 hours.\n\n" +
  "⚠️ Fake referrals will lead to a ban.\n\n" +
  "🔔 Payment updates: @bbpoinideposit"
);

// Notify Admin with Inline Keyboard
var approveLink = "https://t.me/" + bot.name + "?start=approve_" + user.telegramid;

Api.sendMessage({
  chat_id: channel,
  text:
    "<b>💰 New INR Withdrawal Request</b>\n\n" +
    "👤 <b>User:</b> <a href='tg://user?id=" + user.telegramid + "'>" + user.first_name + "</a>\n" +
    "🆔 <b>User ID:</b> <code>" + user.telegramid + "</code>\n" +
    "💸 <b>Amount:</b> " + message + " ₹\n" +
    "🏦 <b>Wallet:</b> " + wallet + "\n\n" +
    "✅ <b>Approve:</b> Click the button below",
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        { text: "✅ Approve Withdrawal", url: approveLink }
      ]
    ]
  }
});

