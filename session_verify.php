<?php
// verificar_sessao.php
// Retorna os dados do usuário logado, ou não autenticado
session_start();
header("Content-Type: application/json");

if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        "logado" => true,
        "usuario" => [
            "id"   => $_SESSION['usuario_id'],
            "nome" => $_SESSION['usuario_nome'],
            "tipo" => $_SESSION['usuario_tipo']
        ]
    ]);
} else {
    echo json_encode(["logado" => false]);
}
?>