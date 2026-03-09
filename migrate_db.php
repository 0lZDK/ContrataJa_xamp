<?php
// migrate_db.php
// Script para adicionar as colunas email e senha se não existirem

require 'conexao.php';

echo "<pre>";
echo "🔧 Verificando e atualizando banco de dados...\n\n";

// Verificar se coluna 'email' existe em 'prestadores'
$result = $conn->query("SHOW COLUMNS FROM prestadores LIKE 'email'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'email' não encontrada em prestadores\n";
    echo "➕ Adicionando coluna 'email'...\n";
    if ($conn->query("ALTER TABLE prestadores ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL AFTER nome")) {
        echo "✅ Coluna 'email' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'email': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'email' já existe\n\n";
}

// Verificar se coluna 'senha' existe em 'prestadores'
$result = $conn->query("SHOW COLUMNS FROM prestadores LIKE 'senha'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'senha' não encontrada em prestadores\n";
    echo "➕ Adicionando coluna 'senha'...\n";
    if ($conn->query("ALTER TABLE prestadores ADD COLUMN senha VARCHAR(255) NOT NULL AFTER email")) {
        echo "✅ Coluna 'senha' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'senha': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'senha' já existe\n\n";
}

// Verificar se coluna 'usuario' existe em 'prestadores'
$result = $conn->query("SHOW COLUMNS FROM prestadores LIKE 'usuario'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'usuario' não encontrada em prestadores\n";
    echo "➕ Adicionando coluna 'usuario'...\n";
    if ($conn->query("ALTER TABLE prestadores ADD COLUMN usuario VARCHAR(100) UNIQUE NOT NULL AFTER email")) {
        echo "✅ Coluna 'usuario' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'usuario': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'usuario' já existe\n\n";
}

// Mesmo para clientes
echo "--- Checando tabela 'clientes' ---\n\n";

$result = $conn->query("SHOW COLUMNS FROM clientes LIKE 'email'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'email' não encontrada em clientes\n";
    echo "➕ Adicionando coluna 'email'...\n";
    if ($conn->query("ALTER TABLE clientes ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL AFTER nome")) {
        echo "✅ Coluna 'email' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'email': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'email' já existe\n\n";
}

$result = $conn->query("SHOW COLUMNS FROM clientes LIKE 'senha'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'senha' não encontrada em clientes\n";
    echo "➕ Adicionando coluna 'senha'...\n";
    if ($conn->query("ALTER TABLE clientes ADD COLUMN senha VARCHAR(255) NOT NULL AFTER email")) {
        echo "✅ Coluna 'senha' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'senha': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'senha' já existe\n\n";
}

$result = $conn->query("SHOW COLUMNS FROM clientes LIKE 'usuario'");
if ($result->num_rows == 0) {
    echo "⚠️  Coluna 'usuario' não encontrada em clientes\n";
    echo "➕ Adicionando coluna 'usuario'...\n";
    if ($conn->query("ALTER TABLE clientes ADD COLUMN usuario VARCHAR(100) UNIQUE NOT NULL AFTER email")) {
        echo "✅ Coluna 'usuario' adicionada com sucesso!\n\n";
    } else {
        echo "❌ Erro ao adicionar 'usuario': " . $conn->error . "\n\n";
    }
} else {
    echo "✅ Coluna 'usuario' já existe\n\n";
}

echo "✅ Banco de dados atualizado com sucesso!\n";
echo "\n🎉 Agora você pode fazer login com email e senha.\n";

$conn->close();
?>
