// import Sort from "../../../../manageApplication/sort/Sort";
import AllStudents from "../allStudents/AllStudents";

const ManageStudents = ({loading,error,applicationDetails}:any) => {
  return (
    <main>
      {/* <Sort /> */}
      <AllStudents />
    </main>
  );
};

export default ManageStudents;
