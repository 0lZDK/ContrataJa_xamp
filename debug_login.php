<?php
// debug_login.php
// Script para debugar problemas de login

require 'conexao.php';

echo "<h2>🔍 Debug de Login</h2>";
echo "<pre>";

// Verificar tabela prestadores
echo "=== TABELA PRESTADORES ===\n";
$result = $conn->query("DESCRIBE prestadores");
echo "Colunas:\n";
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

// Mostrar dados na tabela
echo "\n=== DADOS EM PRESTADORES ===\n";
$result = $conn->query("SELECT id_prestador, nome, email, usuario FROM prestadores");
if ($result->num_rows > 0) {
    echo "Encontrados " . $result->num_rows . " registros:\n";
    while ($row = $result->fetch_assoc()) {
        echo "  ID: {$row['id_prestador']}, Nome: {$row['nome']}, Email: {$row['email']}, Usuario: {$row['usuario']}\n";
    }
} else {
    echo "❌ Nenhum prestador cadastrado ainda\n";
}

// Verificar tabela clientes
echo "\n\n=== TABELA CLIENTES ===\n";
$result = $conn->query("DESCRIBE clientes");
echo "Colunas:\n";
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

// Mostrar dados na tabela
echo "\n=== DADOS EM CLIENTES ===\n";
$result = $conn->query("SELECT id_cliente, nome, email, usuario FROM clientes");
if ($result->num_rows > 0) {
    echo "Encontrados " . $result->num_rows . " registros:\n";
    while ($row = $result->fetch_assoc()) {
        echo "  ID: {$row['id_cliente']}, Nome: {$row['nome']}, Email: {$row['email']}, Usuario: {$row['usuario']}\n";
    }
} else {
    echo "❌ Nenhum cliente cadastrado ainda\n";
}

// Testar login direto
echo "\n\n=== TESTE DE LOGIN ===\n";
if ($_POST) {
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');
    $tipo = $_POST['tipo'] ?? 'cliente';
    
    echo "Tipo: $tipo\n";
    echo "Email/Usuario enviado: '$email'\n";
    echo "Senha enviada: '$senha'\n\n";
    
    if (!empty($email) && !empty($senha)) {
        if ($tipo === 'prestador') {
            $tabela = 'prestadores';
            $campo_id = 'id_prestador';
        } else {
            $tabela = 'clientes';
            $campo_id = 'id_cliente';
        }
        
        // Buscar usuário
        $stmt = $conn->prepare("SELECT $campo_id, nome, email, usuario, senha FROM $tabela WHERE email = ? OR usuario = ? LIMIT 1");
        $stmt->bind_param("ss", $email, $email);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();
            echo "✅ Usuário encontrado:\n";
            echo "   ID: {$usuario[$campo_id]}\n";
            echo "   Nome: {$usuario['nome']}\n";
            echo "   Email: {$usuario['email']}\n";
            echo "   Usuario: {$usuario['usuario']}\n";
            echo "   Hash armazenado: {$usuario['senha']}\n\n";
            
            // Testar password_verify
            if (password_verify($senha, $usuario['senha'])) {
                echo "✅ SENHA CORRETA! Login funcionaria\n";
            } else {
                echo "❌ SENHA INCORRETA\n";
                echo "   A senha '$senha' não corresponde ao hash armazenado\n";
                echo "\n💡 Possíveis causas:\n";
                echo "   1. Senha foi digitada errada no cadastro\n";
                echo "   2. Senha não foi criptografada ao cadastrar\n";
            }
        } else {
            echo "❌ Usuário não encontrado com email/usuario: '$email'\n";
        }
        $stmt->close();
    }
}

echo "\n</pre>";

// Formulário de teste
echo "<hr>";
echo "<h3>Teste de Login</h3>";
echo "<form method='POST'>";
echo "  Tipo: <select name='tipo'>";
echo "    <option value='cliente'>Cliente</option>";
echo "    <option value='prestador'>Prestador</option>";
echo "  </select>";
echo "  <br><br>";
echo "  Email/Usuário: <input type='text' name='email' required>";
echo "  <br><br>";
echo "  Senha: <input type='password' name='senha' required>";
echo "  <br><br>";
echo "  <button type='submit'>Testar Login</button>";
echo "</form>";

$conn->close();
?>

