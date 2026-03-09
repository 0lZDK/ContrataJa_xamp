<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido."]);
    exit;
}

require 'conexao.php';

$dados         = json_decode(file_get_contents("php://input"), true);
$identificador = trim($dados['identificador'] ?? '');
$senha         = $dados['senha']              ?? '';
$tipo          = $dados['tipo']               ?? 'cliente';

if (empty($identificador) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Preencha usuário/email e senha."]);
    exit;
}

if ($tipo === 'prestador') {
    $tabela   = 'prestadores';
    $campo_id = 'id_prestador';
} else {
    $tabela   = 'clientes';
    $campo_id = 'id_cliente';
}

$stmt = $conn->prepare("SELECT $campo_id, nome, usuario, email, senha FROM $tabela WHERE email = ? OR usuario = ? LIMIT 1");
$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuário ou senha incorretos."]);
    exit;
}

$usuario = $resultado->fetch_assoc();

if (!password_verify($senha, $usuario['senha'])) {
    echo json_encode(["success" => false, "message" => "Usuário ou senha incorretos."]);
    exit;
}

// Sessão
$_SESSION['usuario_id']   = $usuario[$campo_id];
$_SESSION['usuario_nome'] = $usuario['nome'];
$_SESSION['usuario_tipo'] = $tipo;

echo json_encode([
    "success" => true,
    "message" => "Login realizado com sucesso!",
    "usuario" => [
        "id"    => $usuario[$campo_id],
        "nome"  => $usuario['nome'],
        "email" => $usuario['email'],
        "tipo"  => $tipo
    ]
]);

$stmt->close();
$conn->close();
?>