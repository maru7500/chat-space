require 'rails_helper'

describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }
  # letメソッドは呼び出された際に初めて実行される、遅延評価という特徴を持っています。

  describe '#index' do

    context 'log in' do
      before do
        login user
        get :index, params: { group_id: group.id }
      end

      it 'assigns @message' do
        # @messageはMessage.newで定義された新しいMessageクラスのインスタンスです
        expect(assigns(:message)).to be_a_new(Message)
        # be_a_newマッチャを利用することで、 対象が引数で指定したクラスのインスタンスかつ未保存のレコードであるかどうか確かめることができます。be_a_newマッチャを利用することで、 対象が引数で指定したクラスのインスタンスかつ未保存のレコードであるかどうか確かめることができます。
      end

      it 'assigns @group' do
        expect(assigns(:group)).to eq group
        # @groupはeqマッチャを利用してassigns(:group)とgroupが同一であることを確かめることでテストできます。
      end

      it 'renders index' do
        expect(response).to render_template :index
      end
    end

    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        # redirect_toマッチャは引数にとったプレフィックスにリダイレクトした際の情報を返すマッチャです。
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
  
  describe '#create' do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
    # attributes_forはcreate、build同様FactoryBotによって定義されるメソッドで、オブジェクトを生成せずにハッシュを生成するという特徴があります。

    context 'log in' do
    # この中にログインしている場合のテストを記述
      before do
        login user
      end

      context 'can save' do
      # この中にメッセージの保存に成功した場合のテストを記述
        subject {
          post :create,
          params: params
        }

        it 'count up message' do
          expect{ subject }.to change(Message, :count).by(1)
        end

        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end

      context 'can not save' do
      # この中にメッセージの保存に失敗した場合のテストを記述
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }

        subject {
          post :create,
          params: invalid_params
        }

        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
          # not_to change(Message, :count)と記述することによって、「Messageモデルのレコード数が変化しないこと ≒ 保存に失敗したこと」を確かめることができます。
        end

        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end

    context 'not log in' do
    # この中にログインしていない場合のテストを記述
      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
        # マッチャの引数に、new_user_session_pathを取ることで、ログイン画面へとリダイレクトしているかどうかを確かめることができます。
      end
    end
  end
end