import "./CourseCard.css";
// import Image from "next/image";
// import image from "../../../../public/image/proflie.png";
interface Course {
  course_id: string;
  course_level: string;
  course_name: string;
  course_date: string;
  course_place: string;
  course_hour: number;
  course_minute: number;
  // course_image: string;
}

const CourseCard = ({
  training,
  openModal,
  handleDeleteTraining,
}: {
  training: Course;
  openModal: (id: string) => void;
  handleDeleteTraining: (id: string) => void;
}) => {
  const formatDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="card"
      style={{
        width: "18rem",
        border: "none",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
      key={training.course_id}
    >
      {/* <Image
        src={image}
        // src={training.course_image || image}
        alt="Course image"
        className="card-img-top"
        width={300}
        height={300}
      /> */}
      <div className="card-body">
        <div className="card-title">
          <span className="card-title-span">{training.course_id}</span>
          <div className="card-title-link">
            <a
              className="card-link-edit"
              onClick={() => openModal(training.course_id)}
            >
              ดูเพิ่มเติม
            </a>
            <span>|</span>
            <a
              className="card-link-delete"
              onClick={() => handleDeleteTraining(training.course_id)}
            >
              ลบ
            </a>
          </div>
        </div>
        <span className="card-subtitle">{training.course_level}</span>
        <div className="card-text">
          <span className="bold-text">{training.course_name}</span>
          <div className="time-place">
            <span>วันที่ : </span>
            <span>{formatDate(training.course_date)}</span>
          </div>
          <div className="time-place">
            <span>สถานที่ : </span>
            <span>{training.course_place}</span>
          </div>
          <div className="time-place">
            <span>จำนวนชั่วโมง : </span>
            <span>
              {training.course_hour +
                " ชั่วโมง" +
                (training.course_minute > 0
                  ? " " + training.course_minute + " นาที"
                  : "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
