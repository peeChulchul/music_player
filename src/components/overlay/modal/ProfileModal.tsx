import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "src/style/modal.module.css";
import Avatar from "../../Avatar";
import useSessionStore from "../../../store/sessionStore";
import { supabase } from "../../../service/client"; // Supabase 클라이언트
import { getPublicUrl, uploadFile } from "../../../service/storageService";
import { updateTable } from "../../../service/tableService";
import useloadingStore from "../../../store/loadingStore";
import useModalStore from "../../../store/modalStore";
import Button from "../../ui/Button";

interface IformValues {
  username: string;
}

function ProfileModal() {
  const { userTable, setUserTable } = useSessionStore();
  const [preview, setPreview] = useState<string | null>(
    `${userTable?.avatar_url}?${Math.random()}` || null
  );
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

  // 이미지 선택 및 미리보기
  const ImageChangehandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div
      className={`${styles.modalcontent} flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg`}
    >
      <button className="relative rounded-full border w-[200px] h-[200px] overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <Avatar src={userTable?.avatar_url} />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={ImageChangehandler}
        />
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <input
          {...register("username")}
          placeholder="이름을 입력해주세요"
          className="border p-2 rounded"
        />
        <div className="flex w-full justify-between">
          <Button>수정완료</Button>
          <Button type="button" onClick={closeModal}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfileModal;
