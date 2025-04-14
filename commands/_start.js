/*CMD
  command: /start
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

var adm = Bot.getProperty("adminID");

// Deep link approval check
if (params && params.startsWith("approve_")) {
  if (user.telegramid != adm) {
    Bot.sendMessage("❌ You are not authorized to approve withdrawals.");
    return;
  }

  let userId = params.split("_")[1];
  let data = Bot.getProperty("withdraw_" + userId);

  if (!data || !data.amount || !data.wallet) {
    Bot.sendMessage("❌ No pending withdrawal for this user.");
    return;
  }

  // Notify user
  Bot.sendMessageToChatWithId(
    userId,
    "✅ Your withdrawal request has been approved! 🎉\n\n" +
    "💰 Amount: " + data.amount + " INR\n" +
    "💼 Wallet: " + data.wallet + "\n\n" +
    "🎊 Payment sent successfully! 🚀"
  );

  // Announce publicly
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
    chat_id: -1002511481346, // change to your channel ID
    text:
      "<b><u>Payout Announcement</u></b>\n\n" +
      "😎 <b>User:</b> <a href='tg://user?id=" + userId + "'>" + data.name + "</a>\n" +
      "💵 <b>Amount:</b> " + data.amount + "\n" +
      "💰 <b>Wallet:</b>\n<code>" + data.wallet + "</code>\n" +
      "⌚ <b>Time:</b> " + time + " (IST)\n\n" +
      "✅ <b>Approved</b>",
    parse_mode: "HTML"
  });

  // Clear withdrawal
  Bot.setProperty("withdraw_" + userId, null);
  Bot.sendMessage("✅ Withdrawal approved for User ID: " + userId);
  return;
}

// Admin login if not yet set
if (!adm) {
  Bot.setProperty("adminID", user.telegramid, "string");
  Bot.sendMessage("🧑‍💻 *Successfully Logged In As Admin With ID:* " + chat.chatid);
  return;
}

// Ask user to join the channel
Api.sendMessage({
  text:
    "<b>⛔ Must Join All Our Channels</b>\n\n➡️ @referearnbotreb\n\n✅ <b>After Joining, Click on 🟢 Joined</b>",
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [[{ text: "🟢 Joined", callback_data: "/joined" }]]
  }
});

// User handle
var hh = user.username ? "[@"+user.username+"]" : "";

// Referral logic
function touchingOwnLink() {
  Bot.sendMessage("*❌ Stop Clicking Your Own Link*");
}
function attractedByUser(refUser) {
  Api.sendMessage({
    chat_id: refUser.telegramid,
    text:
      "<b>🔋 You Got a New </b><a href='tg://user?id=" +
      user.telegramid +
      "'>Referral</a> " + hh +
      "\n<i>💡 Reward Only If Referral Solves the Captcha and Joins Our Channel</i>",
    parse_mode: "html",
    disable_web_page_preview: true
  });
}
function alreadyStarted() {
  Bot.sendMessage("*🚫 You Have Already Started The Bot *");
}

var tracks = {
  onTouchOwnLink: touchingOwnLink,
  onAtractedByUser: attractedByUser,
  onAlreadyAttracted: alreadyStarted,
  linkPrefix: "Bot"
};
RefLib.track(tracks);

// New user tracking
if (!User.getProperty("UserDone")) {
  Bot.setProperty("Chat" + user.telegramid, chat, "json");
  User.setProperty("UserDone", true, "boolean");

  var stat = Libs.ResourcesLib.anotherChatRes("status", "global");
  stat.add(1);

  Api.sendMessage({
    chat_id: adm,
    text:
      "➕ <b>New User Notification</b> ➕\n\n" +
      "👤<b>User:</b> <a href='tg://user?id=" + user.telegramid + "'>" + user.first_name + "</a> " + hh +
      "\n\n🆔<b>User ID:</b> <code>" + user.telegramid + "</code>\n\n🌝 <b>Total Users: " + stat.value() + "</b>",
    parse_mode: "html",
    disable_web_page_preview: true
  });
}

