import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "src/style/modal.module.css";
import Avatar from "../Avatar";
import useSessionStore from "../../store/sessionStore";
import { getPublicUrl, uploadFile } from "../../service/storageService";
import { updateTable } from "../../service/tableService";
import useloadingStore from "../../store/loadingStore";
import useModalStore from "../../store/modalStore";
import { Button, OutlineButton } from "../ui/Button";
import ImageInput from "../ImageInput";

interface IformValues {
  username: string;
}

function ProfileModal() {
  const { userTable, setUserTable } = useSessionStore();

  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit } = useForm<IformValues>({
    defaultValues: {
      username: userTable?.username || "",
    },
  });
  const { openLoading, closeLoading } = useloadingStore();
  const { closeModal } = useModalStore();

  const onSubmit: SubmitHandler<IformValues> = async (formData) => {
    const userId = userTable?.id;
    const bucketName = "image";
    const path = `${userId}`;
    const fileName = "avatar_image";
    openLoading();

    if (userId) {
      if (file) {
        try {
          // 새 이미지 업로드
          await uploadFile({
            bucketName: "image",
            path: `${userId}/${fileName}`,
            file,
          });

          // 업로드된 파일의 URL 얻기
          const publicUrl = await getPublicUrl({
            bucketName,
            fileName,
            path,
          });

          if (publicUrl) {
            // 사용자 테이블의 avatar_url 업데이트
            updateTable({
              eqKey: "id",
              eqValue: userId,
              tableName: "user",
              update: { avatar_url: publicUrl },
            });
            setUserTable({ ...userTable, avatar_url: publicUrl });
          }
        } catch (error) {
          // console.error("Error during image processing:", error);
          return;
        }
      }

      // 사용자 이름 업데이트
      await updateTable({
        tableName: "user",
        eqKey: "id",
        eqValue: userId,
        update: { username: formData.username },
      });

      setUserTable({ ...userTable, username: formData.username });
    }
    closeLoading();
    closeModal();
  };

  return (
    <div
      className={`${styles.modalcontent} flex flex-col items-center gap-4 p-4 min-w-[300px] rounded-lg shadow-lg`}
    >
      <h1 className="text-main-bg font-bold text-lg">프로필 수정</h1>
      <div className="w-[200px] h-[200px]">
        <ImageInput setFile={setFile} imagePreview={userTable!.avatar_url!} />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <input
          {...register("username")}
          placeholder="이름을 입력해주세요"
          className="border p-2 rounded text-text-primary "
        />
        <div className="flex flex-col w-full justify-between">
          <OutlineButton text="text-blue-400" border="border-border">
            수정완료
          </OutlineButton>
          <OutlineButton
            text="text-red-400"
            border="border-border"
            type="button"
            onClick={closeModal}
          >
            취소
          </OutlineButton>
        </div>
      </form>
    </div>
  );
}

export default ProfileModal;
