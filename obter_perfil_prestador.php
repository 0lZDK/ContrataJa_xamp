<?php
// obter_perfil_prestador.php
// Busca dados completos de um prestador específico
// Parâmetro GET: id

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require 'conexao.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "ID do prestador não fornecido."]);
    exit;
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("SELECT id_prestador, nome, cidade, estado, telefone, grupodeinteresse, email FROM prestadores WHERE id_prestador = ? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Prestador não encontrado."]);
    $stmt->close();
    $conn->close();
    exit;
}

$prestador = $resultado->fetch_assoc();

echo json_encode([
    "success" => true,
    "prestador" => $prestador
]);

$stmt->close();
$conn->close();
?>
