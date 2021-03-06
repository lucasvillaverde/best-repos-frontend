import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import RepositoryList from '../../components/repositoryList';
import Loader from 'react-loader-spinner';
import * as api from '../../api';
import { useAlert } from 'react-alert';

import './styles.css';

export default function RepositoriesHistorySection() {
  const [repositoriesHistoryState, setRepositoriesHistoryState] = useState({ isLoading: false });
  const alert = useAlert();

  useEffect( () => {
    async function fetchData() {
      try {
        setRepositoriesHistoryState({ isLoading: true })
        const historyResponse = await api.getRepositoriesHistory();
        setRepositoriesHistoryState({ isLoading: false, repositories: historyResponse.data });
      } catch (err) {
        setRepositoriesHistoryState({ isLoading: false })
        alert.show('Erro: ' + err, {
          timeout: 3000,
          type: 'error',
        })
      }
    }

    fetchData();
  }, [repositoriesHistoryState.historyResponse]);

  const handleClearButton = async () => {
    try {
      await setRepositoriesHistoryState({ isLoading: true })
      await api.clearRepositoriesHistory();
      setRepositoriesHistoryState({ isLoading: false });
      showHistoryCleanedAlert();
    } catch (err) {
      alert.show('Erro: ' + err, {
        timeout: 3000,
        type: 'error',
      })
    }
  }

  function showHistoryCleanedAlert() {
    alert.show('O histórico foi limpo!', {
      timeout: 3000,
      type: 'success',
    })
  }

  function renderContent(){
    if(repositoriesHistoryState.isLoading){
        return (
            <Row className="mt-4">
                <Col className="text-center" xs={12}>
                <Loader
                    type="BallTriangle"
                    color="#dc3545"
                    height={150}
                    width={150}
                />
                </Col>
            </Row>
        );
    }else{
        return(
            <Row className="mt-2" id="RepositoryList">
            <Col md={12} xs={12}>
                <RepositoryList data={repositoriesHistoryState.repositories} />
            </Col>
            </Row>
        );
    }
}

  return (
    <>
      <Row>
        <Col className="text-center" md={12} xs={12} >
          <Button className="search-button" variant="info" onClick={handleClearButton}>Limpar Histórico</Button>
        </Col>
      </Row>
      {renderContent()}
    </>
  );
}
