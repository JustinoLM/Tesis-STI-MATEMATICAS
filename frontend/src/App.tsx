import { BrowserRouter, Routes, Route } from 'react-router-dom'

// TODO: Importar páginas cuando estén creadas
// import Login from '@pages/auth/Login'
// import StudentDashboard from '@pages/student/Dashboard'
// import TeacherDashboard from '@pages/teacher/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="max-w-2xl bg-white rounded-2xl shadow-xl p-12 text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Sistema de Tutoría Inteligente
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Frontend en construcción...
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Estructura del proyecto creada</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <span className="text-gray-700">TailwindCSS configurado</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚛️</span>
                  <span className="text-gray-700">React + TypeScript listo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <span className="text-gray-700">Próximos pasos: Crear componentes y páginas</span>
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* TODO: Descomentar cuando las páginas estén listas */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/teacher/*" element={<TeacherDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
