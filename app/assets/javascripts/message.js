$(function(){
  
  function buildHTML(message){
    
    if (message.image) {
      var html = `
      <div class="main_chat__center--comment">
        <div class="user">
          ${message.name}
            <div class="user__date">
              ${message.date}
            </div>
        </div>
        <div class="user_comment">
          <div class="user_comment__content">
            ${message.content}
          </div>
          <img src=${message.image} >
        </div>
      </div>`
      return html
    } else {
      var html = `
      <div class="main_chat__center--comment">
        <div class="user">
          ${message.name}
            <div class="user__date">
              ${message.date}
            </div>
        </div>
        <div class="user_comment">
          ${message.content}
        </div>
      </div>`
      return html
    }
    
  }


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
});
