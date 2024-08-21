import React, { useState } from "react";

import Signup from "src/components/SignUp";
import styles from "src/style/modal.module.css";
import Login from "src/components/Login";

function AuthModal() {
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  return (
    <div
      className={[styles.modalcontent, "pt-6 px-6 rounded-lg shadow-lg"].join(
        " "
      )}
    >
      {isLoginPage && <Login setIsLoginPage={setIsLoginPage} />}
      {!isLoginPage && <Signup setIsLoginPage={setIsLoginPage} />}
    </div>
  );
}

export default AuthModal;
