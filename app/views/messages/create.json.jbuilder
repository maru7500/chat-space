json.content @message.content
json.image @message.image_url
json.date @message.created_at.strftime("%Y年%m月%d日 %H時%M分")
json.name @message.user.name
#idもデータとして渡す
json.id @message.id
