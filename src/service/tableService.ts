import { AllTables } from "../types/supabase";
import { supabase } from "./client";

interface ItableArgs {
  tableName: AllTables;
}

interface IupdateTableArgs extends ItableArgs {
  update: { [key: string]: string | null };
  eqKey: string;
  eqValue: string;
}
interface IgetAllTableArgs extends ItableArgs {
  eqKey: string;
  eqValue: string;
}
interface IinsertTableArgs extends ItableArgs {
  insertValue: any;
}

interface IupsertTableArgs extends ItableArgs {
  onConflict: string;
  upsertValue: any;
}

export async function updateTable({
  tableName,
  eqKey,
  eqValue,
  update,
}: IupdateTableArgs) {
  const { data, error } = await supabase
    .from(tableName)
    .update(update)
    .eq(eqKey, eqValue);

  if (error) {
    throw new Error(error.message);
  }
  return console.log("업데이트가 완료되었습니다.");
}

export async function getEqTable({
  eqKey,
  eqValue,
  tableName,
}: IgetAllTableArgs) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(eqKey, eqValue);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllTable({ tableName }: ItableArgs) {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function insertTable({
  tableName,
  insertValue,
}: IinsertTableArgs) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([insertValue])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function upsertTable({
  tableName,
  upsertValue,
  onConflict,
}: IupsertTableArgs) {
  const { data, error } = await supabase
    .from(tableName)
    .upsert(upsertValue, { onConflict });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
