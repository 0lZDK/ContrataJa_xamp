<?php
header('Content-Type: application/json; charset=utf-8');

// Dados de conexão
$host = "localhost";
$usuario_db = "root";
$senha_db = "";
$banco = "contrataja";

// Tentar conexão
$conn = new mysqli($host, $usuario_db, $senha_db);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "erro",
        "mensagem" => "Não conseguiu conectar ao MySQL",
        "detalhe" => $conn->connect_error,
        "verificar" => [
            "1" => "Verifique se o XAMPP está rodando",
            "2" => "Verifique se o MySQL está iniciado no XAMPP Control Panel",
            "3" => "Tente reiniciar o XAMPP"
        ]
    ]);
    exit;
}

// Verificar se o banco existe
$result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '$banco'");

if ($result->num_rows == 0) {
    echo json_encode([
        "status" => "aviso",
        "mensagem" => "Banco de dados '$banco' não encontrado",
        "solucao" => "Você precisa criar o banco. Siga os passos:",
        "passos" => [
            "1" => "Abra phpMyAdmin no navegador: http://localhost/phpmyadmin",
            "2" => "Clique em 'Importar' no menu superior",
            "3" => "Selecione o arquivo: sql/contrataja.sql",
            "4" => "Clique em 'Executar' ou 'Go'",
            "5" => "Pronto! O banco será criado com as tabelas"
        ]
    ]);
} else {
    // Banco existe, agora conectar com o banco selecionado
    $conn->select_db($banco);
    
    echo json_encode([
        "status" => "sucesso",
        "mensagem" => "Conexão com o banco '$banco' estabelecida com sucesso!",
        "detalhe" => "Todas as tabelas estão disponíveis"
    ]);
}

$conn->close();
?>
