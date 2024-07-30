export interface IsignUpFormInput {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface IloginFormInput
  extends Pick<IsignUpFormInput, "email" | "password"> {}
