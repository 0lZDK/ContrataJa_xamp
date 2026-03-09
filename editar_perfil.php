<?php
session_start();
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_tipo'] !== 'prestador') {
    header("Location: index.html");
    exit;
}
$id   = (int)$_SESSION['usuario_id'];
$nome = htmlspecialchars($_SESSION['usuario_nome']);
$inicial = strtoupper(mb_substr($_SESSION['usuario_nome'], 0, 1));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Perfil — ContrataJá</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
        (function(){
            var s=localStorage.getItem('cj_theme')||'system', h=document.documentElement;
            if(s==='dark') h.classList.add('dark');
            else if(s==='light') h.classList.add('light');
            else h.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
        })();
    </script>
    <style>
        body { min-height: 100vh; }
        .perfil-wrap {
            max-width: 660px;
            margin: 110px auto 60px;
            padding: 0 20px;
        }
        .perfil-card {
            background: var(--modal-bg, #fff);
            border-radius: 16px;
            padding: 36px 40px;
            box-shadow: 0 4px 24px rgba(0,0,0,.08);
        }
        .perfil-top {
            display: flex; align-items: center; gap: 18px;
            margin-bottom: 28px;
            padding-bottom: 24px;
            border-bottom: 1.5px solid var(--border, #eee);
        }
        .avatar {
            width: 68px; height: 68px; border-radius: 50%;
            background: #183F81; color: #fff;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; font-weight: 700; flex-shrink: 0;
        }
        .perfil-top h1 { font-size: 1.4rem; margin: 0 0 4px; }
        .perfil-top p  { margin: 0; color: #777; font-size: .9rem; }

        .field { margin-bottom: 18px; }
        .field label { display: block; font-weight: 600; font-size: .88rem; margin-bottom: 6px; }
        .field input {
            width: 100%; padding: 10px 14px; box-sizing: border-box;
            border: 1.5px solid #dde; border-radius: 8px;
            font-size: .97rem; font-family: inherit;
            background: var(--input-bg, #f8f9fa);
            color: var(--text-color, #111);
            transition: border-color .2s;
        }
        .field input:focus { outline: none; border-color: #183F81; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .toast {
            padding: 11px 16px; border-radius: 8px;
            margin-bottom: 18px; display: none; font-size: .9rem;
        }
        .toast.ok  { background: #d4edda; color: #155724; }
        .toast.err { background: #f8d7da; color: #721c24; }

        .btn-save {
            width: 100%; padding: 13px; margin-top: 6px;
            background: #183F81; color: #fff; border: none;
            border-radius: 8px; font-size: 1rem; font-weight: 600;
            cursor: pointer; transition: background .2s;
        }
        .btn-save:hover { background: #0e2a57; }
        .btn-save:disabled { opacity: .6; cursor: default; }
        .btn-logout {
            display: block; width: 100%; margin-top: 14px;
            background: none; border: none; color: #e74c3c;
            font-size: .9rem; cursor: pointer; text-align: center;
        }

        html.dark .perfil-card { background: #1e2330; }
        html.dark .field input { background: #252c3a; border-color: #38404f; color: #ddd; }
        html.dark .perfil-top  { border-color: #2a3040; }
        html.dark .perfil-top p { color: #999; }
        @media(max-width:560px){ .row2{grid-template-columns:1fr;} .perfil-card{padding:24px 20px;} }
    </style>
</head>
<body class="theme-prestador" data-role="prestador">

<header class="header">
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-logo" style="cursor:pointer" onclick="location.href='index.html'">
                <img src="img/LogoContrata.png" alt="ContrataJá" class="logo-img"/>
            </div>
            <div class="navbar-buttons header-auth">
                <span style="font-size:.92rem;opacity:.8;margin-right:8px;">Olá, <strong><?= $nome ?></strong></span>
                <button class="btn-login btn-secondary" onclick="sair()">Sair</button>
            </div>
        </div>
    </nav>
</header>

<div class="perfil-wrap">
    <div class="perfil-card">
        <div class="perfil-top">
            <div class="avatar" id="avatarLetra"><?= $inicial ?></div>
            <div>
                <h1 id="nomeExibido"><?= $nome ?></h1>
                <p>Prestador de Serviços</p>
            </div>
        </div>

        <div class="toast ok"  id="toastOk">✓ Perfil atualizado com sucesso!</div>
        <div class="toast err" id="toastErr">Erro ao salvar. Tente novamente.</div>

        <form id="formPerfil">
            <div class="field">
                <label>Nome completo</label>
                <input type="text" id="pf_nome" required>
            </div>
            <div class="field">
                <label>Email</label>
                <input type="email" id="pf_email" required>
            </div>
            <div class="field">
                <label>WhatsApp</label>
                <input type="tel" id="pf_telefone" placeholder="(00) 00000-0000">
            </div>
            <div class="row2">
                <div class="field">
                    <label>Estado</label>
                    <input type="text" id="pf_estado" placeholder="SP" maxlength="2">
                </div>
                <div class="field">
                    <label>Cidade</label>
                    <input type="text" id="pf_cidade" placeholder="São Paulo">
                </div>
            </div>
            <div class="field">
                <label>Categorias de Serviço</label>
                <input type="text" id="pf_grupo" placeholder="Ex: Eletricista, Encanador">
            </div>
            <div class="field">
                <label>Nova senha &nbsp;<small style="font-weight:400;color:#999;">(deixe em branco para não alterar)</small></label>
                <input type="password" id="pf_senha" placeholder="Mínimo 6 caracteres">
            </div>
            <button type="submit" class="btn-save" id="btnSave">Salvar alterações</button>
        </form>

        <button class="btn-logout" onclick="sair()">Sair da conta</button>
    </div>
</div>

<script>
var prestadorId = <?= $id ?>;

// Carregar dados
fetch('obter_perfil_prestador.php?id=' + prestadorId)
    .then(function(r){ return r.json(); })
    .then(function(d){
        if (!d.success) return;
        var p = d.prestador;
        document.getElementById('pf_nome').value     = p.nome     || '';
        document.getElementById('pf_email').value    = p.email    || '';
        document.getElementById('pf_telefone').value = p.telefone || '';
        document.getElementById('pf_estado').value   = p.estado   || '';
        document.getElementById('pf_cidade').value   = p.cidade   || '';
        document.getElementById('pf_grupo').value    = p.grupodeinteresse || '';
    });

// Salvar
document.getElementById('formPerfil').addEventListener('submit', function(e){
    e.preventDefault();
    var btn = document.getElementById('btnSave');
    btn.disabled = true; btn.textContent = 'Salvando...';

    var payload = {
        id:               prestadorId,
        nome:             document.getElementById('pf_nome').value.trim(),
        email:            document.getElementById('pf_email').value.trim(),
        telefone:         document.getElementById('pf_telefone').value.replace(/\D/g,''),
        estado:           document.getElementById('pf_estado').value.trim(),
        cidade:           document.getElementById('pf_cidade').value.trim(),
        grupodeinteresse: document.getElementById('pf_grupo').value.trim(),
        senha:            document.getElementById('pf_senha').value
    };

    fetch('salvar_perfil_prestador.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
        if (d.success) {
            document.getElementById('toastOk').style.display  = 'block';
            document.getElementById('toastErr').style.display = 'none';
            document.getElementById('nomeExibido').textContent = payload.nome;
            document.getElementById('avatarLetra').textContent = payload.nome.charAt(0).toUpperCase();
            setTimeout(function(){ document.getElementById('toastOk').style.display='none'; }, 3000);
            document.getElementById('pf_senha').value = '';
        } else {
            document.getElementById('toastErr').textContent   = d.message || 'Erro ao salvar.';
            document.getElementById('toastErr').style.display = 'block';
            document.getElementById('toastOk').style.display  = 'none';
        }
    })
    .catch(function(){
        document.getElementById('toastErr').textContent   = 'Erro de conexão.';
        document.getElementById('toastErr').style.display = 'block';
    })
    .finally(function(){
        btn.disabled = false; btn.textContent = 'Salvar alterações';
    });
});

function sair(){
    fetch('logout.php').finally(function(){ window.location.href = 'index.html'; });
}
</script>
</body>
</html>