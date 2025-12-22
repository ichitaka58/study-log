export const RenderStudyRecords = (props) => {
  const { studyRecords, onClickDelete } = props;
  return (
    <ul>
      {studyRecords.map((record) => {
        return (
          <li key={record.id} className="study-record">
             <span>
              {record.title} {record.time}時間
            </span>
            <button onClick={() => onClickDelete(record.id)}>削除</button>
          </li>
        );
      })}
    </ul>
  );
};
