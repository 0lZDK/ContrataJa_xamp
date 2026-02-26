<?php
// conexao.php
// Coloque este arquivo na raiz do projeto (mesma pasta do index.html)

$host   = "localhost";
$usuario_db = "root";
$senha_db   = "";          // padrão XAMPP é sem senha
$banco  = "contrataja";

$conn = new mysqli($host, $usuario_db, $senha_db, $banco);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Erro de conexão com o banco de dados."]));
}
?>