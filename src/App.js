import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

const parseResult = (data = []) => {
  return data.map((candidato) => {
    return {
      name: candidato.nm,
      votos: parseInt(candidato.vap).toLocaleString("pt-br"),
      pvotos: candidato.pvap,
    };
  });
};

function App() {
  const [results, setResults] = useState([]);
  const [apurado, setApurado] = useState("0");
  const [isLoading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(
        "https://resultados.tse.jus.br/oficial/ele2022/" +
          "544/dados-simplificados/br/br-c0001-e000544-r.json"
      )
      .then((response) => {
        if (response.status === 200) {
          setResults(parseResult(response.data.cand));
          setApurado(response.data.pst);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setInterval(() => fetchData(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const Loading = () => {
    return (
      isLoading && (
        <Alert key="warning" variant="warning">
          Refreshing..
        </Alert>
      )
    );
  };
  return (
    <div>
      <Loading />
      <Alert key="success" variant="success">
        Apuração {apurado} %
      </Alert>
      <div className="d-grid gap-3">
        <Button onClick={fetchData} disabled={isLoading} variant="secondary" size="lg">
          Atualizar!
        </Button>
        <BootstrapTable data={results} striped hover condensed>
          <TableHeaderColumn dataField="name" isKey dataSort width="300">
            Nome
          </TableHeaderColumn>
          <TableHeaderColumn dataField="votos" dataSort width="300">
            Votos
          </TableHeaderColumn>
          <TableHeaderColumn dataField="pvotos">P. Votos</TableHeaderColumn>
        </BootstrapTable>
      </div>
    </div>
  );
}

export default App;
