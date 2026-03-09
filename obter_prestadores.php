<?php
// obter_prestadores.php
// Retorna lista de prestadores em JSON
// Parâmetros GET: categoria (opcional)

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require 'conexao.php';

$categoria = isset($_GET['categoria']) ? trim($_GET['categoria']) : '';

if (!empty($categoria)) {
    // Buscar prestadores que tenham a categoria especificada
    $stmt = $conn->prepare("SELECT id_prestador, nome, cidade, estado, telefone, grupodeinteresse FROM prestadores WHERE grupodeinteresse LIKE ? ORDER BY nome ASC");
    $search = "%" . $categoria . "%";
    $stmt->bind_param("s", $search);
} else {
    // Buscar todos os prestadores
    $stmt = $conn->prepare("SELECT id_prestador, nome, cidade, estado, telefone, grupodeinteresse FROM prestadores ORDER BY nome ASC");
}

$stmt->execute();
$resultado = $stmt->get_result();

$prestadores = [];
while ($row = $resultado->fetch_assoc()) {
    $prestadores[] = $row;
}

echo json_encode([
    "success" => true,
    "total" => count($prestadores),
    "prestadores" => $prestadores
]);

$stmt->close();
$conn->close();
?>
