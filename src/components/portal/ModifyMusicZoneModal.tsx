import React, { useState } from "react";
import styles from "src/style/modal.module.css";
import { Button, OutlineButton } from "../ui/Button";
import { useForm } from "react-hook-form";
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
import { musicZoneRow } from "../../types/supabase";

interface IModifyMusicZoneModal {
  musicZoneData: musicZoneRow;
}

interface IformValues {
  zone_name: string;
  description: string;
}

function ModifyMusicZoneModal({ musicZoneData }: IModifyMusicZoneModal) {
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
    const update = {
      ...formData,
      user_id,
    };
    const bucketName = "image";
    const tableData = await updateTable({
      tableName,
      eqKey: "id",
      eqValue: musicZoneData.id,
      update,
    });
    const folderPath = `${user_id}/${musicZoneData.id}`;
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
          eqValue: musicZoneData.id,
          tableName,
          update: { musiczone_img: publicUrl },
        });
      }
    }

    closeLoading();
    navigate(`ModifyMusicZone/${user_id}/${musicZoneData.id}`);
    closeModal();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className={[
        styles.modalcontent,
        "p-6 flex flex-col rounded-lg shadow-lg justify-center gap-4 min-w-[300px] items-center",
      ].join(" ")}
    >
      <h1 className="font-bold text-xl">뮤직존 수정</h1>
      <div className="w-[200px] h-[200px]">
        <ImageInput
          setFile={setFile}
          imagePreview={musicZoneData.musiczone_img}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <input
          className="p-2 text-sm border rounded-sm text-text-primary"
          {...register("zone_name", {
            required: "이름을 입력해주세요",
            value: musicZoneData.zone_name,
          })}
          placeholder="이름을 입력해주세요"
        />
        <textarea
          className="p-2 text-sm border rounded-sm text-text-primary resize-none"
          {...register("description", {
            value: musicZoneData.description ? musicZoneData.description : "",
          })}
          placeholder="설명을 입력해주세요"
        />
      </div>
      <div className="w-full flex flex-col">
        <OutlineButton text="text-blue-400" onClick={() => {}}>
          수정하기
        </OutlineButton>
        <OutlineButton text="text-red-400" type="button" onClick={closeModal}>
          취소
        </OutlineButton>
      </div>
    </form>
  );
}

export default ModifyMusicZoneModal;
