import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import { InputStudyData } from "./components/InputStudyData";
import { RenderStudyRecords } from "./components/RenderStudyRecords";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [studyRecords, setStudyRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getStudyRecords();
  }, []);


  const total = useMemo(() => {
    return studyRecords.reduce(
      (accumulator, currentValue) =>
        Number(accumulator) + Number(currentValue.time),0)},
       [studyRecords]);

  const getStudyRecords = async () => {
    const { data, error } = await supabase
      .from("study_records")
      .select("*")
      .order("created_at", {ascending: true});
    if (error) {
      console.error("データ取得エラー:", error);
      setErrorMessage("データが取得できませんでした。");
      return;
    }
    setStudyRecords(data);
  };

  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeTime = (event) => setTime(event.target.value);

  // 新規登録処理
  const onClickAdd = async () => {
    if (title.trim() === "" || time === "") {
      setErrorMessage("学習内容と学習時間は必須入力です。");
      return;
    }
    if (Number(time) < 0) {
      setErrorMessage("学習時間は0より大きい数字を入力してください。");
      return;
    }
    setErrorMessage("");

    const studyRecord = { title, time };
    const { data, error } = await supabase
      .from("study_records")
      .insert(studyRecord)
      .select()
      .single();
    if (error) {
      console.error("データ挿入エラー", error);
      alert("データ挿入エラー")
      return;
    }
    setStudyRecords((prev) => [...prev, data]);
    setTitle("");
    setTime("");
  };

  // 削除処理
  const onClickDelete = async (id) => {
    const { error } = await supabase
      .from("study_records")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(error);
      alert("データの削除に失敗しました");
    } 
    // prev : 今まさに確定している最新のstateを使う
    setStudyRecords((prev) => prev.filter((r) => r.id !== id));
    alert("データを削除しました。");
  };

  return (
    <>
      <h1>学習記録アプリ</h1>
      <InputStudyData
        title={title}
        time={time}
        onChangeTitle={onChangeTitle}
        onChangeTime={onChangeTime}
      />
      <p style={{ color: "red" }}>{errorMessage}</p>
      <div className="input-content">
        入力されている学習内容：<span>{title}</span>
      </div>
      <div className="input-content">
        入力されている時間：<span>{time}</span>
      </div>
      <div>
        <button onClick={onClickAdd}>登録</button>
      </div>
      <RenderStudyRecords
        studyRecords={studyRecords}
        onClickDelete={onClickDelete}
      />
      <p>
        合計時間：<span>{total}</span> / 1000 (h)
      </p>
    </>
  );
}

export default App;
