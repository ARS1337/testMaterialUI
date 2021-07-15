import React, { Suspense } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./App.css";
// import Create from "./components/Create";
const Create = React.lazy(() => import("./components/Create"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<CircularProgress color="inherit" />}>
        <Create />
      </Suspense>
    </div>
  );
}

export default App;
