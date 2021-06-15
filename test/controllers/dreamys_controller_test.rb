require 'test_helper'

class DreamysControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get dreamys_index_url
    assert_response :success
  end

end
