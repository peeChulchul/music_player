import React, { useState } from "react";
import styles from "src/style/modal.module.css";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import useloadingStore from "../../../store/loadingStore";
import useSessionStore from "../../../store/sessionStore";
import {
  createFolder,
  getPublicUrl,
  uploadFile,
} from "../../../service/storageService";
import { insertTable, updateTable } from "../../../service/tableService";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../../store/modalStore";

interface IformValues {
  zone_name: string;
  description: string;
}

function MusicZoneModal() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { openLoading, closeLoading } = useloadingStore();
  const { userTable } = useSessionStore();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<IformValues>();
  const { closeModal } = useModalStore();
  async function onSubmitHandler(formData: IformValues) {
    openLoading();

    const user_id = userTable!.id;
    const tableName = "musiczone";
    const insertValue = {
      ...formData,
      user_id,
    };
    const bucketName = "image";
    const tableData = await insertTable({ tableName, insertValue });
    const folderPath = `${user_id}/${tableData.id}`;
    const fileName = "musiczone_img";
    console.log(tableData);

    await createFolder({ bucketName, path: folderPath });

    if (file) {
      await uploadFile({
        bucketName,
        path: `${folderPath}/${fileName}`,
        file,
      });

      const publicUrl = await getPublicUrl({
        bucketName,
        fileName,
        path: folderPath,
      });

      if (publicUrl) {
        await updateTable({
          eqKey: "id",
          eqValue: tableData.id,
          tableName,
          update: { musiczone_img: publicUrl },
        });
      }
    }

    closeLoading();
    navigate(`addMusicZone/${user_id}/${tableData.id}`);
    closeModal();
  }

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
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className={[styles.modalcontent, "bg-white p-6 flex flex-col"].join(" ")}
    >
      <h1>뮤직존 만들기</h1>
      <button className="cursor-pointer w-[300px] h-[300px] relative">
        {preview ? (
          <img src={preview} className="w-full h-full" />
        ) : (
          <PhotoIcon className="text-stone-900 w-full h-full" />
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={ImageChangehandler}
        />
      </button>
      <input
        {...register("zone_name", {
          required: "이름을 입력해주세요",
        })}
        placeholder="이름을 입력해주세요"
      />
      <input {...register("description")} placeholder="설명을 입력해주세요" />
      <div>
        <Button onClick={() => {}}>만들기</Button>
        <Button onClick={() => {}}>취소</Button>
      </div>
    </form>
  );
}

export default MusicZoneModal;
