class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  # ログイン済ユーザーのみにアクセスを許可する
  before_action :configure_permitted_parameters, if: :devise_controller?
                                              # deviseにまつわる画面に行った時に、という意味

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    # ストロングパラメータに該当する機能です。サインアップ時に入力された「name」キーの内容の保存を許可しています。
  end

end
