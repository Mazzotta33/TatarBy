import './App.css'
import {Route, Routes} from "react-router-dom";
import UploadFile from "./Components/UploadFile.tsx";
import ExportFileTranslate from "./Components/ExportFileTranslate.tsx";
import EditPage from "./Components/EditPage.tsx";
import Layout from "./Components/Layout.tsx";
import VideoWithSubtitles from "./Components/VideoWithSubtitles.tsx";
import ExportFileSub from "./Components/ExportFileSub.tsx";
import AudioPage from "./Components/AudioPage.tsx";
import ExportAudio from "./Components/ExportAudio.tsx";
import Login from "./Components/Login.tsx";
import Registration from "./Components/Registration.tsx";

function App() {

  return (
      <div className="min-h-screen bg-gray-50">
          <Routes>
              <Route path="/" element={<Layout/>}>
                  <Route path="/" element={<Registration/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/upload" element={<UploadFile/>} />
                  <Route path="/edit" element={<EditPage/>} />
                  <Route path="/editSub" element={<VideoWithSubtitles/>} />
                  <Route path="/editAudio" element={<AudioPage/>} />
                  <Route path="/exportTranslate" element={<ExportFileTranslate/>} />
                  <Route path="/exportSub" element={<ExportFileSub/>} />
                  <Route path="/exportAudio" element={<ExportAudio/>} />
              </Route>


          </Routes>
      </div>
  )
}

export default App
