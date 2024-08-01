import { supabase } from "./client";

interface IstorageArgs {
  bucketName: string;
  path: string;
}

interface IuploadFileArgs extends IstorageArgs {
  file: File;
}

interface IgetPublicUrlArgs extends IstorageArgs {
  fileName: string;
}

interface IdeleteFileArgs extends IstorageArgs {
  fileName: string;
}

interface IexistFileArgs extends IstorageArgs {
  fileName: string;
}

export async function createFolder({ bucketName, path }: IstorageArgs) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`${path}/.keep`, new Blob([""]), { upsert: false });

  console.log(data);
  console.log(error);
  if (error) {
    console.error("Error creating user folder:", error.message);
  } else {
    console.log("User folder created successfully", data);
  }
}

export async function uploadFile({ bucketName, path, file }: IuploadFileArgs) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      upsert: true,
    });

  console.log(data);
  console.log(error);
  // 에러 처리
  if (error) {
    console.error("Error uploading file:", error.message);
    return;
  }

  // 업로드 성공 시 데이터 출력
  console.log("File uploaded successfully:", data);
}

export async function getPublicUrl({
  bucketName,
  path,
  fileName,
}: IgetPublicUrlArgs) {
  const fileExist = await ExistsFile({ bucketName, fileName, path });
  let publicUrl;

  if (fileExist) {
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${path}/${fileName}`);
    publicUrl = publicData.publicUrl;
  }
  return publicUrl;
}

export async function deleteFile({
  bucketName,
  fileName,
  path,
}: IdeleteFileArgs) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([`${path}/${fileName}`]);

  if (error) {
    return error;
  }

  return data;
}

export async function ExistsFile({
  bucketName,
  fileName,
  path,
}: IexistFileArgs) {
  const { data: listData, error: listError } = await supabase.storage
    .from(bucketName)
    .list(path);

  console.log(listData);

  if (listError) {
    throw new Error(listError.message);
  }

  const fileExists = listData?.some((file) => file.name === fileName);

  if (!fileExists) {
    throw new Error("파일이 존재하지않습니다.");
  }
  return fileExists;
}
