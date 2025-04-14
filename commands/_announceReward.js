/*CMD
  command: /announceReward
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

var userId = params;
var data = Bot.getProperty("withdraw_" + userId);

if (!data || !data.amount || !data.wallet) {
  Bot.sendMessage("❌ No reward found for this user.");
  return;
}

var username = data.name || "Anonymous";
var amount = data.amount;
var wallet = data.wallet;

function formatTimeIST() {
  var now = new Date();
  var options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  };
  return new Intl.DateTimeFormat("en-IN", options).format(now);
}

var time = formatTimeIST();

Api.sendMessage({
  chat_id: -1002511481346,
  text:
    "<b><u>Payout Announcement</u></b>\n\n" +
    "😎 <b>User:</b> <a href='tg://user?id=" + userId + "'>" + username + "</a>\n" +
    "💵 <b>Amount:</b> " + amount + "\n" +
    "💰 <b>Wallet:</b>\n<code>" + wallet + "</code>\n" +
    "⌚ <b>Time:</b> " + time + " (IST)\n\n" +
    "✅ <b>Approved</b>",
  parse_mode: "HTML",
  disable_web_page_preview: true
});

// ✅ Clear withdrawal record after announcement
Bot.setProperty("withdraw_" + userId, null);

