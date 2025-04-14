/*CMD
  command: 📊 Statistics
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: /stats
  group: 
CMD*/

var payouts = Libs.ResourcesLib.anotherChatRes("payouts", "global")
var status = Libs.ResourcesLib.anotherChatRes("status", "global")
var stats =
  "<b>📊 Bot Live Stats 📊\n\n📤 Total Payouts : " +
  payouts.value().toFixed(2) +
  " Points\n\n💡 Total Users: " +
  status.value().toFixed(0) +
  " User(s)\n\n🤟 Codes Maker: @NoteBookLLM</b>"

Api.sendMessage({
  text: stats,
  parse_mode: "html",
  disable_web_page_preview: true
})

