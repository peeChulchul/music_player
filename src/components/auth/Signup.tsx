import React, { Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IsignUpFormInput } from "src/types/auth";
import styles from "src/style/authForm.module.css";
import { signUp } from "src/service/authService";
import useModalStore from "../../store/modalStore";

interface IsignUpProps {
  setIsLoginPage: Dispatch<SetStateAction<boolean>>;
}

function SignUp({ setIsLoginPage }: IsignUpProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IsignUpFormInput>({ mode: "onChange" });

  const { closeModal } = useModalStore();

  const onSubmit = async (data: IsignUpFormInput) => {
    console.log("Submitted Data:", data);
    const { email, password, username } = data;
    await signUp(email, password, username);
    closeModal();
  };

  const password = watch("password");

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.form_title}>회원가입</h1>
      <div className={styles.input_wrapper}>
        <label className={styles.input_label} htmlFor="email">
          이메일
        </label>
        <input
          className={styles.input}
          placeholder="email@domain.com"
          id="email"
          type="email"
          {...register("email", {
            required: "이메일을 입력해주세요",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "이메일 형식으로 입력해주세요",
            },
          })}
        />
        {errors.email && (
          <p className={styles.input_error}>{errors.email.message}</p>
        )}
      </div>

      <div className={styles.input_wrapper}>
        <label className={styles.input_label} htmlFor="username">
          이름
        </label>
        <input
          className={styles.input}
          id="username"
          {...register("username", {
            required: "사용하실 이름을 입력해주세요",
            pattern: {
              value: /^[a-zA-Z0-9가-힣]{2,}$/,
              message: "2자 이상의 문자, 숫자 또는 한글을 입력해주세요.",
            },
          })}
        />
        {errors.username && (
          <p className={styles.input_error}>{errors.username.message}</p>
        )}
      </div>

      <div className={styles.input_wrapper}>
        <label className={styles.input_label} htmlFor="password">
          비밀번호
        </label>
        <input
          className={styles.input}
          id="password"
          type="password"
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            minLength: {
              value: 10,
              message: "최소 10자리 이상의 비밀번호를 입력해주세요",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{10,}$/,
              message: "비밀번호는 특수문자를 하나 이상 포함해야 합니다.",
            },
            validate: {
              noWhitespace: (value) =>
                !/\s/.test(value) || "비밀번호는 공백을 포함할 수 없습니다.",
            },
          })}
        />
        {errors.password && (
          <p className={styles.input_error}>{errors.password.message}</p>
        )}
      </div>

      <div className={styles.input_wrapper}>
        <label className={styles.input_label} htmlFor="confirmPassword">
          비밀번호 확인
        </label>
        <input
          className={styles.input}
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "비밀번호를 확인해주세요",
            validate: (value) =>
              value === password || "비밀번호가 일치하지 않습니다.",
          })}
        />
        {errors.confirmPassword && (
          <p className={styles.input_error}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button className={styles.form_button} type="submit" disabled={!isValid}>
        회원가입
      </button>
      <button
        onClick={() => setIsLoginPage(true)}
        className={styles.form_chage_button}
      >
        로그인
      </button>
    </form>
  );
}

export default SignUp;
