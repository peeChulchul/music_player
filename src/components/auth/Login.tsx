import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import styles from "src/style/authForm.module.css";
import { IloginFormInput, IsignUpFormInput } from "../../types/auth";
import useModalStore from "../../store/modalStore";
import { signIn } from "../../service/authService";
import { OutlineButton } from "../ui/Button";
interface IloginProps {
  setIsLoginPage: Dispatch<SetStateAction<boolean>>;
}

function Login({ setIsLoginPage }: IloginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IloginFormInput>({ mode: "onChange" });

  const { closeModal } = useModalStore();

  const onSubmit = async (data: IloginFormInput) => {
    console.log("Submitted Data:", data);
    const { email, password } = data;
    await signIn(email, password);
    closeModal();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.form_title}>로그인</h1>
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

      <div className={[styles.input_wrapper, "mb-2"].join(" ")}>
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

      <OutlineButton type="submit">로그인</OutlineButton>
      <OutlineButton
        text="text-blue-500"
        border="border-transparent"
        onClick={() => setIsLoginPage(false)}
      >
        회원가입
      </OutlineButton>
    </form>
  );
}

export default Login;
