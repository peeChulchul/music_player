import React, { useState } from "react";

import Signup from "src/components/auth/SignUp";
import styles from "src/style/modal.module.css";
import Login from "src/components/auth/Login";

function AuthModal() {
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  return (
    <div
      className={[
        styles.modalcontent,
        "bg-white p-6 rounded-lg shadow-lg",
      ].join(" ")}
    >
      {isLoginPage && <Login setIsLoginPage={setIsLoginPage} />}
      {!isLoginPage && <Signup setIsLoginPage={setIsLoginPage} />}
    </div>
  );
}

export default AuthModal;
