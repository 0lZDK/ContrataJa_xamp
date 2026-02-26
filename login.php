<?php
// login.php
// Recebe: { "identificador": "usuario_ou_email", "senha": "...", "tipo": "cliente" ou "prestador" }
// Retorna: JSON com sucesso/erro e dados do usuário

session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require 'conexao.php';

// Só aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido."]);
    exit;
}

// Pega o corpo da requisição (JSON)
$dados = json_decode(file_get_contents("php://input"), true);

$identificador = trim($dados['identificador'] ?? '');
$senha         = $dados['senha'] ?? '';
$tipo          = $dados['tipo'] ?? 'cliente'; // 'cliente' ou 'prestador'

// Validações básicas
if (empty($identificador) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Preencha usuário/email e senha."]);
    exit;
}

// Define tabela e campo ID conforme o tipo
if ($tipo === 'prestador') {
    $tabela = 'prestadores';
    $campo_id = 'id_prestador';
} else {
    $tabela = 'clientes';
    $campo_id = 'id_cliente';
}

// Busca usuário por email OU nome de usuário
$stmt = $conn->prepare("SELECT $campo_id, nome, usuario, email, senha FROM $tabela WHERE email = ? OR usuario = ? LIMIT 1");
$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuário ou senha incorretos."]);
    exit;
}

$usuario = $resultado->fetch_assoc();

// Verifica a senha (hash bcrypt)
if (!password_verify($senha, $usuario['senha'])) {
    echo json_encode(["success" => false, "message" => "Usuário ou senha incorretos."]);
    exit;
}

// Login bem-sucedido! Salva na sessão
$_SESSION['usuario_id']   = $usuario[$campo_id];
$_SESSION['usuario_nome'] = $usuario['nome'];
$_SESSION['usuario_tipo'] = $tipo;

echo json_encode([
    "success" => true,
    "message" => "Login realizado com sucesso!",
    "usuario" => [
        "id"     => $usuario[$campo_id],
        "nome"   => $usuario['nome'],
        "email"  => $usuario['email'],
        "tipo"   => $tipo
    ]
]);

$stmt->close();
$conn->close();
?>