<?php
// cadastro_cliente.php
// Recebe: { "nome", "email", "usuario", "senha", "cidade", "estado", "telefone" }
// Retorna: JSON com sucesso/erro

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$nome     = trim($dados['nome']     ?? '');
$email    = trim($dados['email']    ?? '');
$usuario  = trim($dados['usuario']  ?? '');
$senha    = $dados['senha']         ?? '';
$cidade   = trim($dados['cidade']   ?? '');
$estado   = trim($dados['estado']   ?? '');
$telefone = trim($dados['telefone'] ?? '');

// Validações
if (empty($nome) || empty($email) || empty($usuario) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos obrigatórios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "E-mail inválido."]);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(["success" => false, "message" => "A senha deve ter ao menos 6 caracteres."]);
    exit;
}

// Verifica se email ou usuário já existem
$check = $conn->prepare("SELECT id_cliente FROM clientes WHERE email = ? OR usuario = ? LIMIT 1");
$check->bind_param("ss", $email, $usuario);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "E-mail ou nome de usuário já cadastrado."]);
    $check->close();
    exit;
}
$check->close();

// Criptografa a senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Insere o cliente
$stmt = $conn->prepare("INSERT INTO clientes (nome, email, usuario, senha, cidade, estado, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $nome, $email, $usuario, $senha_hash, $cidade, $estado, $telefone);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cadastro realizado com sucesso!"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao cadastrar. Tente novamente."]);
}

$stmt->close();
$conn->close();
?>