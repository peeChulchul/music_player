import { AllTables } from "../types/supabase";
import { supabase } from "./client";

interface ItableArgs {
  tableName: AllTables;
  eqKey: string;
  eqValue: string;
}

interface IupdateTable extends ItableArgs {
  update: { [key: string]: string };
}

export async function updateTable({
  tableName,
  eqKey,
  eqValue,
  update,
}: IupdateTable) {
  const { data, error } = await supabase
    .from(tableName)
    .update(update)
    .eq(eqKey, eqValue);

  if (error) {
    throw new Error(error.message);
  }
  return console.log("업데이트가 완료되었습니다.");
}

export async function getAllTable({ eqKey, eqValue, tableName }: ItableArgs) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(eqKey, eqValue);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
