import './App.css'
import UploadFile from "./Components/UploadFile.tsx";
import ExportFileTranslate from "./Components/ExportFileTranslate.tsx";
import {Route, Routes} from "react-router-dom";
import EditPage from "./Components/EditPage.tsx";
import Layout from "./Components/Layout.tsx";
import VideoWithSubtitles from "./Components/VideoWithSubtitles.tsx";
import ExportFileSub from "./Components/ExportFileSub.tsx";
import AudioPage from "./Components/AudioPage.tsx";
import ExportAudio from "./Components/ExportAudio.tsx";

function App() {

  return (
      <div className="min-h-screen bg-gray-50">
          <Routes>
              <Route path="/" element={<Layout/>}>
                  <Route index element={<UploadFile/>} />
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
