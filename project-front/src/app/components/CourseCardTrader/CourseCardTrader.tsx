import "./CourseCardTrader.css";

interface Training {
  course_id: string;
  course_level: string;
  course_name: string;
  course_details: string;
  course_date: string;
  course_place: string;
  course_hour: number;
  course_minute: number;
  course_seat: number;
  status: "รออนุมัติ" | "ยืนยันการลงทะเบียน" | "ไม่อนุมัติ";
  statusCourse: "รอยืนยันการผ่านอบรม" | "ยืนยันการผ่านอบรม" | "ไม่ผ่านการอบรม";
  // course_image: string;
}

const CourseCardTrader = ({
  training,
  openModalCourse,
  handleRegisterCourse,
  isRegistered,
  isLocalStorageLoaded,
  // registeredCourseIds,
  // trainings,
  registeredCourseDates,
}: {
  training: Training;
  openModalCourse: (id: string) => void;
  handleRegisterCourse: (id: string) => void;
  isRegistered: boolean;
  registeredCourseIds: string[];
  isLocalStorageLoaded: boolean;
  trainings: Training[];
  registeredCourseDates: string[];
}) => {
  // const formatDate = (utcDate: string) => {
  //   const date = new Date(utcDate);
  //   return date.toLocaleDateString("th-TH", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  // const formatDateOnly = (dateString: string) => dateString.split("T")[0];
  // const isDateRegistered = registeredCourseDates.includes(
  //   formatDateOnly(training.course_date)
  // );

  const formatDateOnly = (dateString?: string): string | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    // ใช้ ISO string แล้วตัดแค่ yyyy-mm-dd
    return date.toISOString().split("T")[0];
  };

  const isDateRegistered = (date: string | undefined) => {
    const formatted = formatDateOnly(date);
    return formatted ? registeredCourseDates.includes(formatted) : false;
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
      <div className="card-body">
        <div className="card-title">
          <span className="card-title-span">{training.course_id}</span>
          <div className="card-title-link">
            {/* {isLocalStorageLoaded && (
              <a className="card-link-add" style={{ textDecoration: "none" }}>
                {isRegistered ? (
                  <i
                    className="bi bi-check-circle-fill "
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "4px",
                      color: "green",
                    }}
                  >
                    {" "}
                    <span style={{ marginLeft: "6px" }}>รออนุมัติ</span>
                  </i>
                ) : isDateRegistered(training?.course_date) ? (
                  <i
                    className="bi bi-x-circle-fill "
                    title="เลือกหลักสูตรในวันนี้ไปแล้ว"
                    style={{
                      fontSize: "0.75rem",
                      marginLeft: "4px",
                      color: "gray",
                    }}
                  >
                    {" "}
                    <span style={{ marginLeft: "6px" }}>
                      ไม่สามารถลงทะเบียนได้
                    </span>
                  </i>
                ) : (
                  <i
                    className="bi bi-plus-circle-dotted"
                    onClick={() => handleRegisterCourse(training.course_id)}
                    style={{ cursor: "pointer", fontSize: "1.7rem" }}
                    title="ลงทะเบียนหลักสูตรนี้"
                  ></i>
                )}
              </a>
            )} */}
            {isLocalStorageLoaded && (
              <a className="card-link-add" style={{ textDecoration: "none" }}>
                {training.status === "ยืนยันการลงทะเบียน" ? (
                  <i
                    className="bi bi-patch-check-fill"
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "4px",
                      color: "blue",
                    }}
                  >
                    <span style={{ marginLeft: "6px" }}>อนุมัติแล้ว</span>
                  </i>
                ) : training.status === "ไม่อนุมัติ" ? (
                  <i
                    className="bi bi-x-circle-fill"
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "4px",
                      color: "red",
                    }}
                  >
                    <span style={{ marginLeft: "6px" }}>ไม่อนุมัติ</span>
                  </i>
                ) : isRegistered ? (
                  <i
                    className="bi bi-check-circle-fill"
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "4px",
                      color: "orange",
                    }}
                  >
                    <span style={{ marginLeft: "6px" }}>รออนุมัติ</span>
                  </i>
                ) : isDateRegistered(training?.course_date) ? (
                  <i
                    className="bi bi-x-circle-fill"
                    style={{
                      fontSize: "0.75rem",
                      marginLeft: "4px",
                      color: "gray",
                    }}
                  >
                    <span style={{ marginLeft: "6px" }}>
                      ไม่สามารถลงทะเบียนได้
                    </span>
                  </i>
                ) : (
                  <i
                    className="bi bi-plus-circle-dotted"
                    onClick={() => handleRegisterCourse(training.course_id)}
                    style={{ cursor: "pointer", fontSize: "1.7rem" }}
                    title="ลงทะเบียนหลักสูตรนี้"
                  ></i>
                )}
              </a>
            )}
          </div>
        </div>
        <span className="card-subtitle">{training.course_level}</span>
        <div className="card-text">
          <span className="bold-text">{training.course_name}</span>
          <div className="time-place">
            <span>วันที่ : </span>
            <span>{formatDateOnly(training?.course_date)}</span>
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
          <div className="time-place">
            <span>สถานะการอบรม : </span>
            <span className={`status-${training.statusCourse}`}>
              {training.statusCourse}
            </span>
          </div>
          <div className="time-place-link">
            <a href="#" onClick={() => openModalCourse(training.course_id)}>
              รายละเอียดหลักสูตร
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardTrader;
