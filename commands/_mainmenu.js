/*CMD
  command: /mainmenu
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 🔙 back
  group: 
CMD*/

var userStat = User.getProperty("userStatus");

// ✅ Check Referral Status
var referCount = User.getProperty("ReferStatus");
if (referCount == undefined) {
  let refUser = RefLib.getAttractedBy();
  if (refUser) {
    var refbal = Libs.ResourcesLib.anotherUserRes("balance", refUser.telegramid);
    refbal.add(refAmount);

    Api.sendMessage({
      chat_id: refUser.telegramid,
      text:
        "🎉 *You have received* `" + refAmount + " Points` *from " + user.first_name + "!*",
      parse_mode: "Markdown"
    });

    User.setProperty("ReferStatus", "valid", "string");
  }
}

// ✅ Delete previous menu message if exists
if (request.data) {
  Api.deleteMessage({
    message_id: request.message.message_id
  });
}

// 🏡 **Main Menu with 🧑‍💻 Admin & 🆘 Support**
var menuText = 
  "🏡 *Welcome To The Main Menu!* 🎉\n\n" +
  "🔹 *Choose an option below:*";

var menuButtons = 
  "💰 Balance, 👫 Invite\n" +
  "🗂 Wallet, 🎁 Bonus, 📤 Withdraw\n" +
  "📊 Statistics, 🎁 Gift, 📄 Transactions\n" +
  "🆘 Support,📋Feedback, 🧑‍💻 Admin";

Bot.sendKeyboard(menuButtons, menuText);

