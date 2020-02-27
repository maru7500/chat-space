$(function(){
  
  function buildHTML(message){
    
    var user_box =`
    <div class="user">
      ${message.name}
        <div class="user__date">
          ${message.date}
        </div>
    </div>`

    if (message.content && message.image ) {
      
      var html = `
      <div class="main_chat__center--comment" data-message-id = ${message.id}>
        ${user_box}
        <div class="user_comment">
          <div class="user_comment__content">
            ${message.content}
          </div>
          <img src=${message.image} >
        </div>
      </div>`
    } else if (message.content){
       var html = `
       <div class="main_chat__center--comment" data-message-id = ${message.id}>
        ${user_box}
       <div class="user_comment">
          ${message.content}
        </div>
      </div>`
    } else if (message.image){
      var html =`
      <div class="main_chat__center--comment" data-message-id = ${message.id}>
        ${user_box}
       <div class="user_comment">
          <img src=${message.image} >
        </div>
      </div>`
    } ;
    return html;
  };


  $("#new_message").on("submit",function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action")
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false
    })
    .done (function(data){
      // ajaxで定義したdataを引数に
      var html = buildHTML(data);
      $(".main_chat__center").append(html);
      // メッセージクラスの一番下に追加
      $("form")[0].reset();
      $('.main_chat__center').animate({ scrollTop: $('.main_chat__center')[0].scrollHeight});
      $(".send").attr("disabled",false);
    })
    .fail(function(){
      alert("Error");
    })
  });

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $(".main_chat__center--comment:last").data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0){
        var insertHTML = " ";
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message){
          insertHTML += buildHTML(message)
        });
        $('.main_chat__center').append(insertHTML)
        $('.main_chat__center').animate({ scrollTop: $('.main_chat__center')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)){
    // 7秒ごとに更新
    setInterval(reloadMessages, 3000);
  }
});
