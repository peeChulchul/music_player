import React, { useState } from "react";
import styles from "src/style/modal.module.css";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import useloadingStore from "../../store/loadingStore";
import useSessionStore from "../../store/sessionStore";
import {
  createFolder,
  getPublicUrl,
  uploadFile,
} from "../../service/storageService";
import { insertTable, updateTable } from "../../service/tableService";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../store/modalStore";
import ImageInput from "../ImageInput";
import { useTrackContext } from "../../store/trackContext";

interface IformValues {
  zone_name: string;
  description: string;
}

function MusicZoneModal() {
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
    navigate(`ModifyMusicZone/${user_id}/${tableData.id}`);
    closeModal();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className={[styles.modalcontent, "bg-white p-6 flex flex-col"].join(" ")}
    >
      <h1>뮤직존 만들기</h1>
      <div className="w-[200px] h-[200px]">
        <ImageInput
          setFile={setFile}
          imagePreview={
            "https://smydpnzfrremvfutiaro.supabase.co/storage/v1/object/public/image/default/default_music.png"
          }
        />
      </div>
      <input
        {...register("zone_name", {
          required: "이름을 입력해주세요",
        })}
        placeholder="이름을 입력해주세요"
      />
      <input {...register("description")} placeholder="설명을 입력해주세요" />
      <div>
        <Button onClick={() => {}}>만들기</Button>
        <Button type="button" onClick={closeModal}>
          취소
        </Button>
      </div>
    </form>
  );
}

export default MusicZoneModal;
