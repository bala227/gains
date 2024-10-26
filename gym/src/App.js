import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Dashboard1 from "./components/Main/Dashboard1";
import Diet from "./components/Main/Diet";
import Feedback from "./components/Main/Feedback";
import Attendance from "./components/Main/Attendance";
import TrainerDashboard from "./components/Trainer/TrainerDashboard";
import TrainerDiet from "./components/Trainer/TrainerDiet";
import OnlineSession from "./components/Main/OnlineSession";
import Exercise from "./components/Main/ExerciseProgressTracking";
import TrainerAttendance from "./components/Trainer/TrainerAttendance";
import TrainerSessionManagement from "./components/Trainer/TrainerSessionManagement";
import TrainerFeedback from "./components/Trainer/TrainerFeedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/dashboard1" element={<Dashboard1 />}/>
        <Route path="/diet" element={<Diet />}/>
        <Route path="/feedback" element={<Feedback />}/>
        <Route path="/attendance" element={<Attendance />}/>
        <Route path="/exercise" element={<Exercise />}/>
        <Route path="/onlinesession" element={<OnlineSession />}/>

        <Route path="/trainerdashboard" element={<TrainerDashboard />}/>
        <Route path="/trainerdiet" element={<TrainerDiet />}/>
        <Route path="/trainerattendance" element={<TrainerAttendance />}/>
        <Route path="/trainersession" element={<TrainerSessionManagement />}/>
        <Route path="/trainerfeedback" element={<TrainerFeedback />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
