// ---------------------------------------------------------------
// Điền thông tin project Firebase của bạn vào đây.
// Lấy tại: Firebase Console > (chọn project) > ⚙️ Project settings
//          > kéo xuống "Your apps" > chọn app Web > mục "SDK setup
//          and configuration" > chọn "Config"
//
// Đây KHÔNG phải là thông tin bí mật — Google cho phép để công khai
// trong mã nguồn front-end. Việc bảo mật dữ liệu do các luật
// (rules) trong thư mục backend/ đảm nhiệm, không phải file này.
// ---------------------------------------------------------------

const firebaseConfig = {
  apiKey: "DÁN_API_KEY_VÀO_ĐÂY",
  authDomain: "TÊN-PROJECT.firebaseapp.com",
  projectId: "TÊN-PROJECT",
  storageBucket: "TÊN-PROJECT.appspot.com",
  messagingSenderId: "DÁN_SENDER_ID_VÀO_ĐÂY",
  appId: "DÁN_APP_ID_VÀO_ĐÂY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
