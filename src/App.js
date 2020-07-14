import React from "react";
import CasosLATAM from "./CasosLATAM.jsx"; // import the actual graph
import "./App.css";

const LATAMDim = {
  width: 425,
  height: 200,
  data: "/data/Condensed.csv",
};

function App() {
  return (
    <div className="App">
      <div>
        <h1>
          Casos Confirmados por Dia de Coronavirus en Latinoamerica (LATAM)
        </h1>
        <body>
          <CasosLATAM
            width={LATAMDim.width}
            height={LATAMDim.height}
            data={LATAMDim.data}
          />
        </body>
      </div>
    </div>
  );
}

export default App;
