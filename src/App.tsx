import './App.css'
import UploadFile from "./Components/UploadFile.tsx";
import ExportFile from "./Components/ExportFile.tsx";
import {Route, Routes} from "react-router-dom";
import EditPage from "./Components/EditPage.tsx";
import Layout from "./Components/Layout.tsx";
import VideoWithSubtitles from "./Components/VideoWithSubtitles.tsx";

function App() {

  return (
      <div className="min-h-screen bg-gray-50">
          <Routes>
              <Route path="/" element={<Layout/>}>
                  <Route index element={<UploadFile/>} />
                  <Route path="/edit" element={<VideoWithSubtitles/>} />
                  <Route path="/export" element={<ExportFile/>} />
              </Route>
          </Routes>
      </div>
  )
}

export default App
