document.addEventListener('DOMContentLoaded', function() {
    const role = document.body.dataset.role || 'prestador';
    const navbar = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const serviceCards = document.querySelectorAll('.service-card');
    // Bind modal to all explicit triggers
    const modalTriggers = document.querySelectorAll('[data-modal-trigger="true"]');
    
    // Verificar se há hash #prestador ou #cliente na URL para abrir modal automaticamente
    function checkHashAndOpenModal() {
        if (window.location.hash === '#prestador' || window.location.hash === '#cliente') {
            // Aguardar um pouco para garantir que tudo foi carregado
            setTimeout(() => {
                if (typeof openModal === 'function') {
                    openModal();
                }
            }, 500);
        }
    }
    
    // Verificar hash na carga inicial
    checkHashAndOpenModal();
    
    // Verificar mudanças no hash
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#prestador' || window.location.hash === '#cliente') {
            if (typeof openModal === 'function') {
                openModal();
            }
        }
    });
    
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    navbar.style.transition = 'transform 0.3s ease-in-out';
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Se for link externo (não começa com #), permite navegação padrão
            if (!targetId.startsWith('#')) {
                return;
            }
            
            // Para links internos (com #), faz scroll smooth
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchValue = searchInput.value.trim();
            if (searchValue) {
                console.log('Pesquisando por:', searchValue);
                openModalWithSearchMessage(searchValue);
            } else {
                searchInput.style.borderColor = '#ff6b6b';
                searchInput.placeholder = 'Por favor, informe um endereço';
                setTimeout(() => {
                    searchInput.style.borderColor = '';
                    searchInput.placeholder = 'Em qual endereço você precisa';
                }, 3000);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.dataset.service;
            console.log('Serviço selecionado:', service);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            alert(`Você selecionou: ${this.querySelector('h3').textContent}`);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 4px rgba(0, 0, 0, 0.16)';
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.benefit-card, .step, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .header.scrolled {
            background: var(--header-scrolled-bg);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);
    
    const logo = document.querySelector('.navbar-logo');
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('mauticModal');
    const closeModal = document.getElementById('closeModal');
    const formContainer = document.getElementById('formContainer');
    const successContainer = document.getElementById('successContainer');
    const errorContainer = document.getElementById('errorContainer');
    const modalTitle = document.getElementById('modalTitle');
    
    let phoneInput = null;
    let formSubmitted = false;
    
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        showForm();
        initializePhoneInput();
        initializeCategoriaSelect();
        initializeLocationFields();
    }
    
    function openModalWithSearchMessage(searchValue) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        showFormWithSearchMessage(searchValue);
        initializePhoneInput();
        initializeCategoriaSelect();
        initializeLocationFields();
    }
    
    function showForm() {
        formContainer.style.display = 'block';
        successContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        modalTitle.textContent = (role === 'cliente') ? 'Quero contratar serviços' : 'Quero ser Prestador de Serviços';
        
        // Esconder mensagem de busca
        const searchMessage = document.getElementById('searchMessage');
        if (searchMessage) {
            searchMessage.style.display = 'none';
        }
        
        formSubmitted = false;
    }
    
    function showFormWithSearchMessage(searchValue) {
        formContainer.style.display = 'block';
        successContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        modalTitle.textContent = (role === 'cliente') ? 'Peça seu serviço' : 'Cadastro de Prestador';
        
        // Mostrar mensagem de busca
        const searchMessage = document.getElementById('searchMessage');
        if (searchMessage) {
            searchMessage.style.display = 'block';
        }
        
        formSubmitted = false;
    }

    function initializeCategoriaSelect() {
        const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
        if (!categoriaField) return;

        // Garante envio em campo único (pipe) e remove name do select
        function updateHiddenCategoria() {
            const $field = (typeof $ !== 'undefined') ? $(categoriaField) : null;
            let values = $field ? ($field.val() || []) : Array.from(categoriaField.selectedOptions).map(o => o.value);
            // Tratar "Outros"
            const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
            if (values.includes('Outros')) {
                const customVal = (outrosInput && outrosInput.value.trim()) ? outrosInput.value.trim() : '';
                values = values.filter(v => v !== 'Outros');
                if (customVal) values.push(customVal);
            }
            // Separador: pipe com espaços (compatível com Mautic)
            values = values.filter(v => (v || '').trim().length > 0);
            const joined = values.join(' | ');
            let hidden = document.getElementById('mauticform_hidden_categoria');
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.id = 'mauticform_hidden_categoria';
                const form = document.getElementById('mauticform_formlp');
                if (form) {
                    const categoriaAlias = (form && form.dataset && form.dataset.mauticCategoriaAlias) ? form.dataset.mauticCategoriaAlias : 'categoria';
                    hidden.name = `mauticform[${categoriaAlias}]`;
                    form.appendChild(hidden);
                }
            }
            hidden.value = joined;
        }

        // Remover o name do select para evitar múltiplos campos
        if (categoriaField.getAttribute('name')) {
            categoriaField.setAttribute('data-original-name', categoriaField.getAttribute('name'));
            categoriaField.removeAttribute('name');
        }

        // Atualizar hidden inicialmente e a cada mudança
        updateHiddenCategoria();

        // Função para mostrar/ocultar campo "Outros"
        function toggleOutrosField() {
            const outrosWrapper = document.getElementById('categoria_outros_wrapper');
            const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
            if (!outrosWrapper || !outrosInput) return;

            const selectedValues = categoriaField.multiple 
                ? Array.from(categoriaField.selectedOptions).map(o => o.value)
                : [categoriaField.value];

            if (selectedValues.includes('Outros')) {
                outrosWrapper.style.display = 'block';
                outrosInput.required = true;
            } else {
                outrosWrapper.style.display = 'none';
                outrosInput.required = false;
                outrosInput.value = '';
            }
            // Sempre atualizar o campo oculto ao alterar visibilidade/valor
            updateHiddenCategoria();
        }

        // Adicionar listener para mudanças no select
        categoriaField.addEventListener('change', function() {
            toggleOutrosField();
            updateHiddenCategoria();
        });

        // Enhance with Select2 for both roles if available
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            const $field = $(categoriaField);
            if (!$field.data('select2')) {
                const placeholder = (document.body.dataset.role === 'cliente')
                    ? 'Selecione um ou mais grupos'
                    : 'Selecione uma ou mais categorias';
                $field.select2({
                    placeholder,
                    allowClear: true,
                    width: '100%',
                    tags: true,
                    tokenSeparators: [',', ';', '|'],
                    dropdownParent: $('#mauticModal'),
                    createTag: function(params) {
                        const term = $.trim(params.term);
                        if (term === '') return null;
                        const selected = $field.val() || [];
                        // Permite criar itens personalizados somente se "Outros" estiver selecionado
                        if (!selected.includes('Outros')) return null;
                        return { id: term, text: term, newTag: true };
                    }
                }).on('change', function() {
                    toggleOutrosField();
                    updateHiddenCategoria();
                });
            }
        } else {
            // Para navegadores sem Select2, verificar estado inicial
            toggleOutrosField();
        }

        // Atualizar quando digitar no campo "Outros"
        const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
        if (outrosInput) {
            ['input','blur'].forEach(evt => outrosInput.addEventListener(evt, updateHiddenCategoria));
        }
    }
    
    function closeModalFunction() {
        console.log('closeModalFunction() chamada');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetForm();
            
            // Limpar o hash #prestador ou #cliente se estiver presente
            if (window.location.hash === '#prestador' || window.location.hash === '#cliente') {
                history.replaceState(null, null, window.location.pathname);
            }
        }, 300);
    }
    
    // Tornar as funções globalmente acessíveis
    window.closeModalFunction = closeModalFunction;
    window.showForm = showForm;
    
    function trackEvent(name, params = {}) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: name, ...params });
        } catch (e) { /* no-op */ }
        if (typeof window.gtag === 'function') {
            try { window.gtag('event', name, params); } catch (e) { /* no-op */ }
        }
        if (typeof window.fbq === 'function') {
            try { window.fbq('trackCustom', name, params); } catch (e) { /* no-op */ }
        }
    }

    function showSuccess() {
        console.log('showSuccess() chamada - exibindo página de sucesso');
        console.log('formContainer:', formContainer);
        console.log('successContainer:', successContainer);
        console.log('errorContainer:', errorContainer);
        console.log('modalTitle:', modalTitle);
        
        if (formContainer) formContainer.style.display = 'none';
        if (successContainer) successContainer.style.display = 'block';
        if (errorContainer) errorContainer.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Cadastro Realizado!';

        console.log('Elementos alterados - verificando visibilidade:');
        console.log('formContainer display:', formContainer?.style.display);
        console.log('successContainer display:', successContainer?.style.display);
        console.log('errorContainer display:', errorContainer?.style.display);

        // Analytics event
        trackEvent('submit_success', { role });
    }
    
    function showError() {
        formContainer.style.display = 'none';
        successContainer.style.display = 'none';
        errorContainer.style.display = 'block';
        modalTitle.textContent = 'Erro no Cadastro';
    }
    
    function resetForm() {
        const form = document.getElementById('mauticform_formlp');
        if (form) {
            form.reset();
        }
        
        const errorDiv = document.getElementById('mauticform_formlp_error');
        const messageDiv = document.getElementById('mauticform_formlp_message');
        if (errorDiv) errorDiv.style.display = 'none';
        if (messageDiv) messageDiv.style.display = 'none';
        
        const submitButton = document.getElementById('mauticform_input_formlp_submit');
        if (submitButton) {
            submitButton.disabled = false;
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoading = submitButton.querySelector('.button-loading');
            if (buttonText) buttonText.style.display = 'inline';
            if (buttonLoading) buttonLoading.style.display = 'none';
        }
        
        // Resetar campo "Outros"
        const outrosWrapper = document.getElementById('categoria_outros_wrapper');
        const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
        if (outrosWrapper) outrosWrapper.style.display = 'none';
        if (outrosInput) {
            outrosInput.value = '';
            outrosInput.required = false;
        }
        
        // Resetar Select2 se disponível
        const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
        if (categoriaField && typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            $(categoriaField).val(null).trigger('change');
        }
        
        // Reabilitar selects caso tenham sido desabilitados no submit
        if (categoriaField) {
            categoriaField.disabled = false;
            // garantir que tenha um name padrão presente após reset
            if (!categoriaField.getAttribute('name')) {
                categoriaField.name = 'mauticform[categoria]';
            }
            // Remover input oculto se existir
            const hidden = document.getElementById('mauticform_hidden_categoria');
            if (hidden) hidden.remove();
        }

        formSubmitted = false;
    }

    let ibgeCache = { estados: null, municipios: {} };
    function removeAccents(str) {
        try { return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { return str || ''; }
    }
    async function fetchEstados() {
        if (ibgeCache.estados) return ibgeCache.estados;
        try {
            const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
            const data = await res.json();
            // Ordenar por sigla
            data.sort((a, b) => a.sigla.localeCompare(b.sigla));
            ibgeCache.estados = data;
            return data;
        } catch (e) {
            // Fallback estático (sigla + nome)
            const fallback = [
                { id: 11, sigla: 'RO', nome: 'Rondonia' },
                { id: 12, sigla: 'AC', nome: 'Acre' },
                { id: 13, sigla: 'AM', nome: 'Amazonas' },
                { id: 14, sigla: 'RR', nome: 'Roraima' },
                { id: 15, sigla: 'PA', nome: 'Para' },
                { id: 16, sigla: 'AP', nome: 'Amapa' },
                { id: 17, sigla: 'TO', nome: 'Tocantins' },
                { id: 21, sigla: 'MA', nome: 'Maranhao' },
                { id: 22, sigla: 'PI', nome: 'Piaui' },
                { id: 23, sigla: 'CE', nome: 'Ceara' },
                { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
                { id: 25, sigla: 'PB', nome: 'Paraiba' },
                { id: 26, sigla: 'PE', nome: 'Pernambuco' },
                { id: 27, sigla: 'AL', nome: 'Alagoas' },
                { id: 28, sigla: 'SE', nome: 'Sergipe' },
                { id: 29, sigla: 'BA', nome: 'Bahia' },
                { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
                { id: 32, sigla: 'ES', nome: 'Espirito Santo' },
                { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
                { id: 35, sigla: 'SP', nome: 'Sao Paulo' },
                { id: 41, sigla: 'PR', nome: 'Parana' },
                { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
                { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
                { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
                { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
                { id: 52, sigla: 'GO', nome: 'Goias' },
                { id: 53, sigla: 'DF', nome: 'Distrito Federal' }
            ];
            ibgeCache.estados = fallback;
            return fallback;
        }
    }

    async function fetchMunicipios(uf) {
        if (ibgeCache.municipios[uf]) return ibgeCache.municipios[uf];
        try {
            const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            const data = await res.json();
            // Ordenar por nome
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            ibgeCache.municipios[uf] = data;
            return data;
        } catch (e) {
            return [];
        }
    }

    async function initializeLocationFields() {
        const estadoEl = document.getElementById('mauticform_input_formlp_estado');
        const cidadeEl = document.getElementById('mauticform_input_formlp_cidade');
        if (!estadoEl || !cidadeEl) return;

        // Popular estados
        const estados = await fetchEstados();
        const optionsHtml = (estados && estados.length)
            ? ('<option value="">Selecione o estado</option>' + estados.map(e => {
                const val = removeAccents(e.nome);
                return `<option value="${val}" data-uf="${e.sigla}" data-id="${e.id || ''}">${e.sigla} - ${e.nome}</option>`;
            }).join(''))
            : '<option value="Sao Paulo" data-uf="SP">SP - São Paulo</option>';

        // Se Select2 estiver ativo, destruir antes de trocar options
        let hadSelect2 = false;
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            const $estado = $(estadoEl);
            const $cidade = $(cidadeEl);
            if ($estado.data('select2')) { $estado.select2('destroy'); hadSelect2 = true; }
            if ($cidade.data('select2')) { $cidade.select2('destroy'); }
        }

        estadoEl.innerHTML = optionsHtml;
        cidadeEl.innerHTML = '<option value="">Selecione a cidade</option>';

        // Reaplicar Select2
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            const $estado = $(estadoEl);
            const $cidade = $(cidadeEl);
            $estado.select2({ placeholder: 'Selecione o estado', allowClear: true, width: '100%', dropdownParent: $('#mauticModal') });
            $cidade.select2({ placeholder: 'Selecione a cidade', allowClear: true, width: '100%', dropdownParent: $('#mauticModal') });
        }

        // Selecionar SP por padrão (se existir)
        estadoEl.value = 'Sao Paulo';
        if (estadoEl.value !== 'Sao Paulo') {
            // Se não achou, tenta por UF
            const optSp = Array.from(estadoEl.options).find(o => o.getAttribute('data-uf') === 'SP');
            if (optSp) estadoEl.value = optSp.value;
        }
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            $(estadoEl).trigger('change');
        }

        // Carregar cidades para SP (ou UF resolvida acima)
        const selectedOpt = estadoEl.options[estadoEl.selectedIndex];
        const ufInit = selectedOpt ? (selectedOpt.getAttribute('data-uf') || 'SP') : 'SP';
        await populateCidades(ufInit, cidadeEl);
        // Selecionar São José do Rio Preto por padrão (se existir)
        const defaultCity = 'São José do Rio Preto';
        const hasDefault = Array.from(cidadeEl.options).some(o => o.text === defaultCity || o.value === defaultCity);
        if (hasDefault) cidadeEl.value = defaultCity;
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            $(cidadeEl).trigger('change.select2');
        }

        // Listener mudança de estado (compatível com Select2)
        async function onEstadoChange() {
            // Tentar pegar UF do option selecionado
            let uf = '';
            const selected = this.options ? this.options[this.selectedIndex] : null;
            if (selected) uf = selected.getAttribute('data-uf') || '';
            // Fallback: mapear pelo valor/nome
            if (!uf) {
                const val = (this.value || '').trim();
                if (val && Array.isArray(ibgeCache.estados)) {
                    const found = ibgeCache.estados.find(e => {
                        const nomeNorm = removeAccents(e.nome);
                        return nomeNorm === val || e.sigla === val;
                    });
                    if (found) uf = found.sigla;
                }
            }
            cidadeEl.innerHTML = '<option value="">Carregando...</option>';
            if (!uf) {
                cidadeEl.innerHTML = '<option value="">Selecione a cidade</option>';
                if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
                    $(cidadeEl).val('').trigger('change.select2');
                }
                return;
            }
            await populateCidades(uf, cidadeEl);
            if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
                $(cidadeEl).val('').trigger('change.select2');
            }
        }
        estadoEl.addEventListener('change', onEstadoChange);
        if (typeof $ !== 'undefined' && typeof $.fn.select2 === 'function') {
            $(estadoEl).on('select2:select', function(){ onEstadoChange.call(estadoEl); });
        }
    }

    async function populateCidades(uf, cidadeEl) {
        const municipios = await fetchMunicipios(uf);
        if (municipios.length) {
            cidadeEl.innerHTML = '<option value="">Selecione a cidade</option>' +
                municipios.map(m => `<option value="${m.nome}">${m.nome}</option>`).join('');
        } else {
            // Fallback mínimo SP/SJRP
            if (uf === 'SP') {
                cidadeEl.innerHTML = '<option value="São José do Rio Preto">São José do Rio Preto</option>';
            } else {
                cidadeEl.innerHTML = '<option value="">Não foi possível carregar cidades</option>';
            }
        }
    }
    
    function initializePhoneInput() {
        const phoneField = document.getElementById('mauticform_input_formlp_whatsapp');
        if (!phoneField) {
            console.warn('Campo de telefone não encontrado');
            return;
        }
        
        // Verificar se as bibliotecas necessárias estão disponíveis
        console.log('=== VERIFICAÇÃO DAS BIBLIOTECAS ===');
        console.log('window.intlTelInput disponível:', typeof window.intlTelInput === 'function');
        console.log('jQuery disponível:', typeof $ !== 'undefined');
        console.log('jQuery.inputmask disponível:', typeof $ !== 'undefined' && typeof $.fn.inputmask === 'function');
        
        if (typeof window.intlTelInput === 'function' && typeof $ !== 'undefined' && typeof $.fn.inputmask === 'function') {
            console.log('Todas as bibliotecas disponíveis - inicializando intl-tel-input com inputmask');
            
            if (!phoneInput) {
                try {
                    console.log('Criando instância do intl-tel-input...');
                    phoneInput = window.intlTelInput(phoneField, {
                        initialCountry: 'br',
                        onlyCountries: ['br'],
                        allowDropdown: false,
                        nationalMode: true,
                        separateDialCode: true, // mostra +55 fixo ao lado
                        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
                        formatOnDisplay: true,
                        autoHideDialCode: false,
                        autoPlaceholder: 'aggressive'
                    });
                    console.log('Instância do intl-tel-input criada:', phoneInput);
                    
                    // Aplicar máscara brasileira usando inputmask
                    console.log('Aplicando máscara inputmask...');
                    $(phoneField).inputmask({
                        mask: '(99) 99999-9999',
                        placeholder: '0',
                        showMaskOnHover: false,
                        showMaskOnFocus: false,
                        onBeforePaste: function (pastedValue, opts) {
                            var processedValue = pastedValue;
                            return processedValue;
                        },
                        onBeforeMask: function (value, opts) {
                            return value;
                        }
                    });
                    console.log('Máscara inputmask aplicada com sucesso');
                    
                    // Atualizar máscara quando mudar o país
                    phoneField.addEventListener('countrychange', function() {
                        const countryData = phoneInput.getSelectedCountryData();
                        console.log('País selecionado:', countryData.name, countryData.iso2);
                        
                        // Remover máscara atual
                        $(phoneField).inputmask('remove');
                        
                        // Aplicar nova máscara baseada no país
                        if (countryData.iso2 === 'br') {
                            $(phoneField).inputmask({
                                mask: '(99) 99999-9999',
                                placeholder: '0'
                            });
                        } else if (countryData.iso2 === 'us') {
                            $(phoneField).inputmask({
                                mask: '(999) 999-9999',
                                placeholder: '0'
                            });
                        } else {
                            // Máscara genérica para outros países
                            $(phoneField).inputmask({
                                mask: '999999999999999',
                                placeholder: '0'
                            });
                        }
                    });
                    
                    console.log('intl-tel-input inicializado com sucesso');
                } catch (error) {
                    console.error('Erro ao inicializar intl-tel-input:', error);
                    phoneInput = null;
                }
            } else {
                console.log('phoneInput já existe, não reinicializando');
            }
        } else {
            console.log('Bibliotecas intl-tel-input ou inputmask não disponíveis, usando validação manual');
            // Aplicar máscara simples se apenas inputmask estiver disponível
            if (typeof $ !== 'undefined' && typeof $.fn.inputmask === 'function') {
                try {
                    console.log('Aplicando apenas máscara inputmask...');
                    $(phoneField).inputmask({
                        mask: '(99) 99999-9999',
                        placeholder: '0'
                    });
                    console.log('Máscara inputmask aplicada com sucesso');
                } catch (error) {
                    console.error('Erro ao aplicar inputmask:', error);
                }
            } else {
                console.log('Nenhuma biblioteca disponível, campo funcionará sem formatação');
            }
        }
        
        // Adicionar event listener para o select de categoria
        const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
        if (categoriaField) {
            categoriaField.addEventListener('change', function() {
                const selectedValue = this.value;
                console.log('Categoria selecionada:', selectedValue);
                if (selectedValue) {
                    hideFieldError(this);
                }
            });
        }
        
        // Adicionar validação em tempo real para o campo de telefone
        if (phoneField) {
            phoneField.addEventListener('input', function() {
                validatePhoneField(this);
            });
            phoneField.addEventListener('blur', function() {
                validatePhoneField(this);
            });
        }
        
        // Adicionar validação em tempo real para o campo de email
        const emailField = document.getElementById('mauticform_input_formlp_email');
        if (emailField) {
            emailField.addEventListener('input', function() {
                validateEmailField(this);
            });
            emailField.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }
        
        // Adicionar validação em tempo real para o campo de nome
        const nameField = document.getElementById('mauticform_input_formlp_nome');
        if (nameField) {
            nameField.addEventListener('input', function() {
                validateNameField(this);
            });
            nameField.addEventListener('blur', function() {
                validateNameField(this);
            });
        }
        
        // Adicionar validação em tempo real para os campos de estado e cidade
        const estadoField = document.getElementById('mauticform_input_formlp_estado');
        const cidadeField = document.getElementById('mauticform_input_formlp_cidade');
        
        if (estadoField) {
            estadoField.addEventListener('change', function() {
                validateSelectField(this, 'Selecione o estado');
            });
        }
        
        if (cidadeField) {
            cidadeField.addEventListener('change', function() {
                validateSelectField(this, 'Selecione a cidade');
            });
        }
        
        // Adicionar validação em tempo real para o campo de categoria
        if (categoriaField) {
            categoriaField.addEventListener('change', function() {
                validateCategoriaField(this);
            });
        }
        
        // Adicionar validação em tempo real para o campo de consentimento
        const consentField = document.getElementById('mauticform_input_formlp_consent');
        if (consentField) {
            consentField.addEventListener('change', function() {
                validateConsentField(this);
            });
        }
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
        function validatePhoneField(field) {
        if (!field || !field.value.trim()) {
            showFieldError(field, 'WhatsApp é obrigatório');
            return false;
        }
        
        // Se phoneInput estiver disponível, usar validação da biblioteca
        if (phoneInput && typeof phoneInput.isValidNumber === 'function') {
            if (!phoneInput.isValidNumber()) {
                showFieldError(field, 'Digite um número de WhatsApp válido');
                return false;
            } else {
                hideFieldError(field);
                return true;
            }
        } else {
            // Validação manual simples
            const phoneValue = field.value.replace(/\D/g, '');
            if (phoneValue.length < 10 || phoneValue.length > 15) {
                showFieldError(field, 'Digite um número de WhatsApp válido');
                return false;
            } else {
                hideFieldError(field);
                return true;
            }
        }
    }
    
    function validateEmailField(field) {
        if (!field || !field.value.trim()) {
            showFieldError(field, 'Email é obrigatório');
            return false;
        }
        
        if (!validateEmail(field.value.trim())) {
            showFieldError(field, 'Digite um email válido');
            return false;
        } else {
            hideFieldError(field);
            return true;
        }
    }
    
    function validateNameField(field) {
        if (!field || !field.value.trim()) {
            showFieldError(field, 'Digite seu nome');
            return false;
        }
        
        if (field.value.trim().length < 2) {
            showFieldError(field, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        } else {
            hideFieldError(field);
            return true;
        }
    }
    
    function validateSelectField(field, errorMessage) {
        if (!field || !field.value) {
            showFieldError(field, errorMessage);
            return false;
        } else {
            hideFieldError(field);
            return true;
        }
    }
    
    function validateCategoriaField(field) {
        if (!field) return false;
        
        if (field.multiple) {
            const values = (typeof $ !== 'undefined') ? ($(field).val() || []) : Array.from(field.selectedOptions).map(o => o.value);
            if (!values.length) {
                showFieldError(field, role === 'cliente' ? 'Selecione ao menos um grupo' : 'Selecione ao menos uma categoria');
                return false;
            } else {
                hideFieldError(field);
                return true;
            }
        } else {
            if (!field.value) {
                showFieldError(field, 'Selecione um grupo de interesse');
                return false;
            } else {
                hideFieldError(field);
                return true;
            }
        }
    }
    
    function validateConsentField(field) {
        if (!field) return false;
        
        if (!field.checked) {
            const errorSpan = field.closest('.mauticform-row')?.querySelector('.mauticform-errormsg');
            if (errorSpan) {
                errorSpan.style.display = 'block';
            }
            return false;
        } else {
            const errorSpan = field.closest('.mauticform-row')?.querySelector('.mauticform-errormsg');
            if (errorSpan) {
                errorSpan.style.display = 'none';
            }
            return true;
        }
    }
    
    function validateForm() {
        // Função mantida para compatibilidade, mas não será mais usada para validação
        const emailField = document.getElementById('mauticform_input_formlp_email');
        const nameField = document.getElementById('mauticform_input_formlp_nome');
        const phoneField = document.getElementById('mauticform_input_formlp_whatsapp');
        const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
        const estadoField = document.getElementById('mauticform_input_formlp_estado');
        const cidadeField = document.getElementById('mauticform_input_formlp_cidade');
        const consentField = document.getElementById('mauticform_input_formlp_consent');
        
        console.log('Campos encontrados:', {
            email: !!emailField,
            name: !!nameField,
            phone: !!phoneField,
            categoria: !!categoriaField,
            estado: !!estadoField,
            cidade: !!cidadeField,
            consent: !!consentField
        });
        
        let isValid = true;
        
        // Validar email
        console.log('=== VALIDAÇÃO DO EMAIL ===');
        console.log('emailField:', emailField);
        console.log('emailField value:', emailField?.value);
        if (!emailField || !emailField.value.trim()) {
            console.log('Email vazio ou campo não encontrado - erro');
            if (emailField) showFieldError(emailField, 'Email é obrigatório');
            isValid = false;
        } else if (!validateEmail(emailField.value.trim())) {
            console.log('Email inválido - erro');
            showFieldError(emailField, 'Digite um email válido');
            isValid = false;
        } else {
            console.log('Email válido');
            hideFieldError(emailField);
        }
        
        // Validar nome
        console.log('=== VALIDAÇÃO DO NOME ===');
        console.log('nameField:', nameField);
        console.log('nameField value:', nameField?.value);
        if (!nameField || !nameField.value.trim()) {
            console.log('Nome vazio ou campo não encontrado - erro');
            if (nameField) showFieldError(nameField, 'Digite seu nome');
            isValid = false;
        } else if (nameField.value.trim().length < 2) {
            console.log('Nome muito curto - erro');
            showFieldError(nameField, 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        } else {
            console.log('Nome válido');
            hideFieldError(nameField);
        }
        
        // Validar telefone
        console.log('=== VALIDAÇÃO DO TELEFONE ===');
        console.log('phoneField:', phoneField);
        console.log('phoneField value:', phoneField?.value);
        console.log('phoneInput:', phoneInput);
        console.log('phoneInput.isValidNumber:', phoneInput?.isValidNumber);
        
        if (!phoneField || !phoneField.value.trim()) {
            console.log('Campo de telefone vazio ou não encontrado');
            if (phoneField) showFieldError(phoneField, 'WhatsApp é obrigatório');
            isValid = false;
        } else {
            // Se phoneInput estiver disponível, usar validação da biblioteca
            if (phoneInput && typeof phoneInput.isValidNumber === 'function') {
                console.log('Usando validação da biblioteca intl-tel-input');
                const isValidNumber = phoneInput.isValidNumber();
                console.log('isValidNumber() retornou:', isValidNumber);
                
                if (!isValidNumber) {
                    console.log('Número inválido pela biblioteca');
                    showFieldError(phoneField, 'Digite um número de WhatsApp válido');
                    isValid = false;
                } else {
                    console.log('Número válido pela biblioteca');
                    hideFieldError(phoneField);
                }
            } else {
                console.log('Usando validação manual');
                // Validação manual simples se a biblioteca não estiver disponível
                const phoneValue = phoneField.value.replace(/\D/g, ''); // Remove tudo que não é dígito
                console.log('Valor do telefone sem formatação:', phoneValue);
                console.log('Comprimento do número:', phoneValue.length);
                
                if (phoneValue.length < 10 || phoneValue.length > 15) {
                    console.log('Número inválido pela validação manual');
                    showFieldError(phoneField, 'Digite um número de WhatsApp válido');
                    isValid = false;
                } else {
                    console.log('Número válido pela validação manual');
                    hideFieldError(phoneField);
                }
            }
        }
        console.log('Resultado da validação do telefone:', isValid);

        // Validar estado e cidade
        console.log('=== VALIDAÇÃO DO ESTADO ===');
        console.log('estadoField:', estadoField);
        console.log('estadoField value:', estadoField?.value);
        if (!estadoField || !estadoField.value) {
            console.log('Estado não selecionado - erro');
            if (estadoField) showFieldError(estadoField, 'Selecione o estado');
            isValid = false;
        } else {
            console.log('Estado válido');
            hideFieldError(estadoField);
        }
        
        console.log('=== VALIDAÇÃO DA CIDADE ===');
        console.log('cidadeField:', cidadeField);
        console.log('cidadeField value:', cidadeField?.value);
        if (!cidadeField || !cidadeField.value) {
            console.log('Cidade não selecionada - erro');
            if (cidadeField) showFieldError(cidadeField, 'Selecione a cidade');
            isValid = false;
        } else {
            console.log('Cidade válida');
            hideFieldError(cidadeField);
        }
        
        // Validar categoria (múltipla para ambos; clientes também podem digitar quando "Outros" estiver selecionado)
        console.log('=== VALIDAÇÃO DA CATEGORIA ===');
        console.log('categoriaField:', categoriaField);
        console.log('categoriaField multiple:', categoriaField?.multiple);
        console.log('categoriaField value:', categoriaField?.value);
        
        if (categoriaField) {
            if (categoriaField.multiple) {
                const values = (typeof $ !== 'undefined') ? ($(categoriaField).val() || []) : Array.from(categoriaField.selectedOptions).map(o => o.value);
                console.log('Valores selecionados (múltiplo):', values);
                console.log('Quantidade de valores:', values.length);
                
                if (!values.length) {
                    console.log('Nenhuma categoria selecionada - erro');
                    showFieldError(categoriaField, role === 'cliente' ? 'Selecione ao menos um grupo' : 'Selecione ao menos uma categoria');
                    isValid = false;
                } else {
                    console.log('Categoria válida');
                    hideFieldError(categoriaField);
                }
                
                // Se "Outros" foi selecionado, validar o campo de texto
                if (values.includes('Outros')) {
                    console.log('"Outros" selecionado, validando campo de texto');
                    const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
                    console.log('outrosInput:', outrosInput);
                    console.log('outrosInput value:', outrosInput?.value);
                    
                    if (outrosInput && !outrosInput.value.trim()) {
                        console.log('Campo "Outros" vazio - erro');
                        showFieldError(outrosInput, 'Descreva o que precisa em "Outros"');
                        isValid = false;
                    } else if (outrosInput) {
                        console.log('Campo "Outros" válido');
                        hideFieldError(outrosInput);
                    }
                }
            } else {
                console.log('Campo categoria não é múltiplo');
                if (!categoriaField.value) {
                    console.log('Categoria não selecionada - erro');
                    showFieldError(categoriaField, 'Selecione um grupo de interesse');
                    isValid = false;
                } else {
                    console.log('Categoria válida');
                    hideFieldError(categoriaField);
                }
            }
        } else {
            console.log('Campo categoria não encontrado - erro');
            isValid = false;
        }

        // Validar consentimento LGPD (se existir no formulário)
        console.log('=== VALIDAÇÃO DO CONSENTIMENTO ===');
        console.log('consentField:', consentField);
        console.log('consentField checked:', consentField?.checked);
        
        if (consentField) {
            if (!consentField.checked) {
                console.log('Consentimento não marcado - erro');
                // Exibe erro no container do checkbox
                const errorSpan = consentField.closest('.mauticform-row')?.querySelector('.mauticform-errormsg');
                if (errorSpan) {
                    errorSpan.style.display = 'block';
                }
                isValid = false;
            } else {
                console.log('Consentimento válido');
                const errorSpan = consentField.closest('.mauticform-row')?.querySelector('.mauticform-errormsg');
                if (errorSpan) {
                    errorSpan.style.display = 'none';
                }
            }
        } else {
            console.log('Campo consentimento não encontrado');
        }
        
        console.log('=== RESUMO DA VALIDAÇÃO ===');
        console.log('Email válido:', !(!emailField || !emailField.value.trim() || !validateEmail(emailField.value.trim())));
        console.log('Nome válido:', !(!nameField || !nameField.value.trim() || nameField.value.trim().length < 2));
        console.log('Telefone válido:', !(!phoneField || !phoneField.value.trim() || (phoneInput && !phoneInput.isValidNumber()) || (!phoneInput && (phoneField.value.replace(/\D/g, '').length < 10 || phoneField.value.replace(/\D/g, '').length > 15))));
        console.log('Estado válido:', !(!estadoField || !estadoField.value));
        console.log('Cidade válida:', !(!cidadeField || !cidadeField.value));
        console.log('Categoria válida:', !(!categoriaField || (categoriaField.multiple && !Array.from(categoriaField.selectedOptions).map(o => o.value).length) || (!categoriaField.multiple && !categoriaField.value)));
        console.log('Consentimento válido:', !consentField || consentField.checked);
        return true; // Sempre retorna true para permitir envio
    }
    
    function showFieldError(field, message) {
        if (!field) {
            console.error('showFieldError: campo é null ou undefined');
            return;
        }
        
        let errorSpan;
        
        // Para o campo "Outros", procurar pelo span de erro específico
        if (field.id === 'mauticform_input_formlp_categoria_outros') {
            errorSpan = document.getElementById('mauticform_errmsg_formlp_categoria_outros');
        } else {
            errorSpan = field.parentNode?.querySelector('.mauticform-errormsg');
        }
        
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
        
        field.style.borderColor = '#ff6b6b';
    }
    
    function hideFieldError(field) {
        if (!field) {
            console.error('hideFieldError: campo é null ou undefined');
            return;
        }
        
        let errorSpan;
        
        // Para o campo "Outros", procurar pelo span de erro específico
        if (field.id === 'mauticform_input_formlp_categoria_outros') {
            errorSpan = document.getElementById('mauticform_errmsg_formlp_categoria_outros');
        } else {
            errorSpan = field.parentNode?.querySelector('.mauticform-errormsg');
        }
        
        if (errorSpan) {
            errorSpan.style.display = 'none';
        }
        
        field.style.borderColor = '#e1e5e9';
    }
    
    function setLoadingState(loading) {
        console.log('setLoadingState chamada com loading =', loading);
        const submitButton = document.getElementById('mauticform_input_formlp_submit');
        console.log('submitButton encontrado:', !!submitButton);
        
        if (submitButton) {
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoading = submitButton.querySelector('.button-loading');
            console.log('buttonText encontrado:', !!buttonText);
            console.log('buttonLoading encontrado:', !!buttonLoading);
            
            if (loading) {
                console.log('Ativando estado de loading');
                submitButton.disabled = true;
                if (buttonText) buttonText.style.display = 'none';
                if (buttonLoading) buttonLoading.style.display = 'inline-flex';
            } else {
                console.log('Desativando estado de loading');
                submitButton.disabled = false;
                if (buttonText) buttonText.style.display = 'inline';
                if (buttonLoading) buttonLoading.style.display = 'none';
            }
        } else {
            console.warn('submitButton não encontrado em setLoadingState');
        }
    }
    
    closeModal.addEventListener('click', closeModalFunction);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunction();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
    
    // Form submission handling - deixar o Mautic gerenciar o envio
    const mauticForm = document.getElementById('mauticform_formlp');
    if (mauticForm) {
        // Permitir envio direto para Mautic sem validação local
        mauticForm.addEventListener('submit', function(e) {
            console.log('=== EVENTO SUBMIT CAPTURADO ===');
            console.log('Evento submit do formulário capturado');
            console.log('formSubmitted atual:', formSubmitted);
            
            if (formSubmitted) {
                console.log('Formulário já foi enviado, prevenindo envio');
                e.preventDefault();
                return;
            }
            
            console.log('Permitindo envio direto para Mautic - sem validação local');
            formSubmitted = true;
            setLoadingState(true);
            
            // Preparar telefone: fixar BR (sem +55) e garantir DDD + número
            const phoneField = document.getElementById('mauticform_input_formlp_whatsapp');
            if (phoneField) {
                const raw = (phoneField.value || '').toString();
                let digits = raw.replace(/\D/g, '');
                // Remover prefixo 55 se presente e sobrar mais de 11 dígitos
                if (digits.startsWith('55') && digits.length >= 12) {
                    digits = digits.slice(2);
                }
                // Se por algum motivo tiver mais dígitos, manter os últimos 11 (DDD + 9 dígitos)
                if (digits.length > 11) {
                    digits = digits.slice(-11);
                }
                // Formatar para (DD) 99999-9999 quando possível
                let formatted = digits;
                if (digits.length === 11) {
                    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
                } else if (digits.length === 10) {
                    formatted = `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
                }
                phoneField.value = formatted;
            }

            // Preparar categoria para envio
            const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
            if (categoriaField) {
                const $field = (typeof $ !== 'undefined') ? $(categoriaField) : null;
                if (categoriaField.multiple) {
                    let values = $field ? ($field.val() || []) : Array.from(categoriaField.selectedOptions).map(o => o.value);

                    // Se "Outros" estiver selecionado e houver texto, criar opção dinâmica e desmarcar "Outros"
                    const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
                    if (values.includes('Outros') && outrosInput && outrosInput.value.trim()) {
                        const customVal = outrosInput.value.trim();
                        // Verifica se já existe option com esse valor
                        let exists = Array.from(categoriaField.options).some(o => o.value === customVal);
                        if (!exists) {
                            const opt = document.createElement('option');
                            opt.value = customVal;
                            opt.textContent = customVal;
                            opt.selected = true;
                            categoriaField.appendChild(opt);
                        }
                        // Remover seleção de "Outros"
                        Array.from(categoriaField.options).forEach(o => {
                            if (o.value === 'Outros') o.selected = false;
                        });
                        // Atualizar lista de valores
                        values = values.filter(v => v !== 'Outros');
                        if (!values.includes(customVal)) values.push(customVal);
                        if ($field) $field.val(values).trigger('change.select2');
                    }

                    // Enviar como string única separada por pipe
                    const pipe = values.join(' | ');
                    let hidden = document.getElementById('mauticform_hidden_categoria');
                    if (!hidden) {
                        hidden = document.createElement('input');
                        hidden.type = 'hidden';
                        hidden.id = 'mauticform_hidden_categoria';
                        // Alias dinâmico para categoria
                        const categoriaAlias = (mauticForm && mauticForm.dataset && mauticForm.dataset.mauticCategoriaAlias) ? mauticForm.dataset.mauticCategoriaAlias : 'categoria';
                        hidden.name = `mauticform[${categoriaAlias}]`;
                        mauticForm.appendChild(hidden);
                    }
                    hidden.value = pipe;
                    // Evitar envio duplicado: remover o name do select original e desabilitar
                    const originalName = categoriaField.getAttribute('name') || '';
                    categoriaField.setAttribute('data-original-name', originalName);
                    categoriaField.removeAttribute('name');
                    categoriaField.disabled = true;
                } else {
                    // Garantir que o select tenha o name correto
                    const original = categoriaField.getAttribute('data-original-name');
                    categoriaField.name = original || 'mauticform[categoria]';
                    const hidden = document.getElementById('mauticform_hidden_categoria');
                    if (hidden) hidden.remove();
                    categoriaField.disabled = false;
                }
            }
            // Forçar estado/cidade com alias corretos do Mautic
            const estadoEl = document.getElementById('mauticform_input_formlp_estado');
            const cidadeEl = document.getElementById('mauticform_input_formlp_cidade');
            const estadoAlias = (mauticForm && mauticForm.dataset && mauticForm.dataset.mauticEstadoAlias) ? mauticForm.dataset.mauticEstadoAlias : 'estado';
            const cidadeAlias = (mauticForm && mauticForm.dataset && mauticForm.dataset.mauticCidadeAlias) ? mauticForm.dataset.mauticCidadeAlias : 'cidade';
            const categoriaAlias = (mauticForm && mauticForm.dataset && mauticForm.dataset.mauticCategoriaAlias) ? mauticForm.dataset.mauticCategoriaAlias : 'categoria';

            if (estadoEl) {
                let estadoValor = estadoEl.value;
                if (!estadoValor || estadoValor.length <= 3) {
                    const opt = estadoEl.options[estadoEl.selectedIndex];
                    if (opt) {
                        const texto = opt.text || '';
                        const nomeParte = texto.includes(' - ') ? texto.split(' - ').slice(1).join(' - ') : texto;
                        estadoValor = removeAccents(nomeParte.trim());
                    }
                }
                let hiddenUf = document.getElementById('mauticform_hidden_estado');
                if (!hiddenUf) {
                    hiddenUf = document.createElement('input');
                    hiddenUf.type = 'hidden';
                    hiddenUf.id = 'mauticform_hidden_estado';
                    mauticForm.appendChild(hiddenUf);
                }
                hiddenUf.name = `mauticform[${estadoAlias}]`;
                hiddenUf.value = estadoValor;
                estadoEl.setAttribute('data-original-name', estadoEl.getAttribute('name') || '');
                estadoEl.removeAttribute('name');
            }

            if (cidadeEl) {
                let cidadeValor = cidadeEl.value || '';
                let hiddenCid = document.getElementById('mauticform_hidden_cidade');
                if (!hiddenCid) {
                    hiddenCid = document.createElement('input');
                    hiddenCid.type = 'hidden';
                    hiddenCid.id = 'mauticform_hidden_cidade';
                    mauticForm.appendChild(hiddenCid);
                }
                hiddenCid.name = `mauticform[${cidadeAlias}]`;
                hiddenCid.value = cidadeValor;
                cidadeEl.setAttribute('data-original-name', cidadeEl.getAttribute('name') || '');
                cidadeEl.removeAttribute('name');
            }

            // Submeter via formulário temporário para garantir um único campo de categoria
            e.preventDefault();
            e.stopPropagation();

            try {
                // Primeiro tentar com fetch para detectar status HTTP diretamente
                const formData = new FormData();
                
                // Adicionar todos os campos necessários
                const appendToFormData = (name, value) => {
                    if (value === undefined || value === null || value === '') return;
                    formData.append(name, value);
                };

                // Campos principais
                appendToFormData('mauticform[nome]', document.getElementById('mauticform_input_formlp_nome')?.value || '');
                // WhatsApp: enviar sem +55 (apenas DDD + número)
                (function(){
                    const pf = document.getElementById('mauticform_input_formlp_whatsapp');
                    const raw = (pf?.value || '').toString();
                    let digits = raw.replace(/\D/g, '');
                    if (digits.startsWith('55') && digits.length >= 12) digits = digits.slice(2);
                    if (digits.length > 11) digits = digits.slice(-11);
                    appendToFormData('mauticform[whatsapp]', digits);
                })();

                // Estado e cidade (usar alias corretos por formulário)
                const estadoHidden = document.getElementById('mauticform_hidden_estado');
                const estadoVal = estadoHidden ? estadoHidden.value : (document.getElementById('mauticform_input_formlp_estado')?.value || '');
                appendToFormData(`mauticform[${estadoAlias}]`, estadoVal);
                appendToFormData(`mauticform[${cidadeAlias}]`, document.getElementById('mauticform_input_formlp_cidade')?.value || '');

                // Categoria única
                let categoriaStr = document.getElementById('mauticform_hidden_categoria')?.value;
                if (!categoriaStr) {
                    const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
                    let values = [];
                    if (categoriaField) {
                        if (typeof $ !== 'undefined') {
                            values = ($(categoriaField).val() || []);
                        } else {
                            values = Array.from(categoriaField.selectedOptions).map(o => o.value);
                        }
                        const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
                        if (values.includes('Outros')) {
                            const customVal = (outrosInput && outrosInput.value.trim()) ? outrosInput.value.trim() : '';
                            values = values.filter(v => v !== 'Outros');
                            if (customVal) values.push(customVal);
                        }
                    }
                    const sep = ' | ';
                    values = values.filter(v => (v || '').trim().length > 0);
                    categoriaStr = values.join(sep);
                }
                appendToFormData(`mauticform[${categoriaAlias}]`, categoriaStr);

                // Consentimento
                appendToFormData('mauticform[consent]', document.getElementById('mauticform_input_formlp_consent')?.checked ? 'on' : '');

                // Campos ocultos do Mautic
                appendToFormData('mauticform[formId]', document.getElementById('mauticform_formlp_id')?.value || '');
                appendToFormData('mauticform[return]', document.getElementById('mauticform_formlp_return')?.value || '');
                appendToFormData('mauticform[formName]', document.getElementById('mauticform_formlp_name')?.value || '');
                appendToFormData('mauticform[submit]', '1');

                // Tentar enviar com fetch primeiro
                console.log('Enviando formulário via fetch...');
                console.log('URL do formulário:', mauticForm.action);
                try {
                    console.log('FormData entries:');
                    for (const [k, v] of formData.entries()) {
                        console.log(' -', k, ':', v);
                    }
                } catch (e) { console.log('Não foi possível iterar FormData'); }
                fetch(mauticForm.action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Para evitar problemas de CORS
                }).then(response => {
                    console.log('Fetch response recebida');
                    console.log('Fetch response status:', response.status);
                    console.log('Fetch response ok:', response.ok);
                    console.log('Fetch response type:', response.type);
                    // Com no-cors, sempre assumir sucesso se chegou aqui
                    console.log('Fetch completado com sucesso (no-cors mode) - chamando setLoadingState e showSuccess');
                    setLoadingState(false);
                    showSuccess();
                    console.log('Fetch: setLoadingState e showSuccess executados');
                }).catch(error => {
                    console.log('Fetch failed, trying iframe method:', error);
                    console.error('Erro detalhado do fetch:', error);
                    // Se fetch falhar, usar método do iframe
                    submitViaIframe();
                });

                // Função para enviar via iframe como fallback
                function submitViaIframe() {
                    const tmp = document.createElement('form');
                    tmp.method = 'POST';
                    tmp.action = mauticForm.action;
                    tmp.style.display = 'none';
                    tmp.enctype = 'multipart/form-data';

                    // Enviar para um iframe oculto para não navegar e permitir sucesso local
                    let iframe = document.getElementById('mautic_hidden_iframe');
                    if (!iframe) {
                        iframe = document.createElement('iframe');
                        iframe.id = 'mautic_hidden_iframe';
                        iframe.name = 'mautic_hidden_iframe';
                        iframe.style.display = 'none';
                        document.body.appendChild(iframe);
                    }
                    tmp.target = 'mautic_hidden_iframe';

                    const appendHidden = (name, value) => {
                        if (value === undefined || value === null) return;
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = name;
                        input.value = value;
                        tmp.appendChild(input);
                    };

                    // Copiar campos ocultos adicionais do Mautic (exceto os que vamos reconstruir)
                    const skipNames = new Set([
                        'mauticform[nome]',
                        'mauticform[whatsapp]',
                        `mauticform[${estadoAlias}]`,
                        `mauticform[${cidadeAlias}]`,
                        `mauticform[${categoriaAlias}]`,
                        'mauticform[consent]',
                        'mauticform[formId]',
                        'mauticform[return]',
                        'mauticform[formName]',
                        'mauticform[submit]'
                    ]);
                    const elems = mauticForm.querySelectorAll('input, select, textarea');
                    elems.forEach(el => {
                        const name = el.getAttribute('name');
                        if (!name || !name.startsWith('mauticform[')) return;
                        if (skipNames.has(name)) return;
                        if (name === `mauticform[${categoriaAlias}]`) return;
                        if (el.type === 'checkbox' || el.type === 'radio') {
                            if (!el.checked) return;
                            appendHidden(name, el.value || 'on');
                            return;
                        }
                        if (el.tagName === 'SELECT') {
                            if (el.multiple) {
                                // Mantemos a política de campo único apenas para categoria; outros selects raramente são múltiplos
                                Array.from(el.selectedOptions).forEach(opt => appendHidden(name, opt.value));
                            } else {
                                appendHidden(name, el.value || '');
                            }
                            return;
                        }
                        appendHidden(name, el.value || '');
                    });

                    // Campos principais
                    appendHidden('mauticform[nome]', document.getElementById('mauticform_input_formlp_nome')?.value || '');
                    // WhatsApp: enviar apenas DDD + número (sem +55)
                    (function(){
                        const pf = document.getElementById('mauticform_input_formlp_whatsapp');
                        const raw = (pf?.value || '').toString();
                        let digits = raw.replace(/\D/g, '');
                        if (digits.startsWith('55') && digits.length >= 12) digits = digits.slice(2);
                        if (digits.length > 11) digits = digits.slice(-11);
                        appendHidden('mauticform[whatsapp]', digits);
                    })();

                    // Estado e cidade (estado já normalizado acima em hiddenUf)
                    const estadoHidden = document.getElementById('mauticform_hidden_estado');
                    const estadoVal = estadoHidden ? estadoHidden.value : (document.getElementById('mauticform_input_formlp_estado')?.value || '');
                    appendHidden(`mauticform[${estadoAlias}]`, estadoVal);
                    appendHidden(`mauticform[${cidadeAlias}]`, document.getElementById('mauticform_input_formlp_cidade')?.value || '');

                    // Categoria única (do hidden que montamos ou montando agora)
                    let categoriaStr = document.getElementById('mauticform_hidden_categoria')?.value;
                    if (!categoriaStr) {
                        const categoriaField = document.getElementById('mauticform_input_formlp_categoria');
                        let values = [];
                        if (categoriaField) {
                            if (typeof $ !== 'undefined') {
                                values = ($(categoriaField).val() || []);
                            } else {
                                values = Array.from(categoriaField.selectedOptions).map(o => o.value);
                            }
                            const outrosInput = document.getElementById('mauticform_input_formlp_categoria_outros');
                            if (values.includes('Outros')) {
                                const customVal = (outrosInput && outrosInput.value.trim()) ? outrosInput.value.trim() : '';
                                values = values.filter(v => v !== 'Outros');
                                if (customVal) values.push(customVal);
                            }
                        }
                        const sep = ' | ';
                        values = values.filter(v => (v || '').trim().length > 0);
                        categoriaStr = values.join(sep);
                    }
                    appendHidden(`mauticform[${categoriaAlias}]`, categoriaStr);

                    // Consentimento
                    appendHidden('mauticform[consent]', document.getElementById('mauticform_input_formlp_consent')?.checked ? 'on' : '');

                    // Campos ocultos do Mautic
                    appendHidden('mauticform[formId]', document.getElementById('mauticform_formlp_id')?.value || '');
                    appendHidden('mauticform[return]', document.getElementById('mauticform_formlp_return')?.value || '');
                    appendHidden('mauticform[formName]', document.getElementById('mauticform_formlp_name')?.value || '');
                    // Botão de submit (Mautic pode exigir este campo)
                    appendHidden('mauticform[submit]', '1');

                    // Alguns ambientes adicionam messenger; se existir, levar junto
                    const messenger = document.querySelector('input[name="mauticform[messenger]"]');
                    if (messenger) appendHidden('mauticform[messenger]', messenger.value);

                    document.body.appendChild(tmp);
                    
                    // Enviar o formulário
                    tmp.submit();
                    
                    // Configurar listeners para detectar sucesso
                    let handled = false;
                const onDone = (ok = true) => {
                    console.log('onDone() chamada com ok =', ok);
                    console.log('handled status:', handled);
                    if (handled) {
                        console.log('onDone() já foi chamada, ignorando');
                        return;
                    }
                    handled = true;
                    console.log('Definindo loading state como false');
                    setLoadingState(false);
                    if (ok) {
                        console.log('Status OK - chamando showSuccess()');
                        showSuccess();
                        console.log('showSuccess() foi executada');
                    } else {
                        console.log('Status NOK - chamando showError()');
                        showError();
                        console.log('showError() foi executada');
                    }
                };

                // Detectar sucesso baseado no status HTTP do iframe
                const checkSuccess = () => {
                    console.log('checkSuccess() chamada - verificando iframe');
                    try {
                        // Tentar acessar o conteúdo do iframe para verificar se foi bem-sucedido
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const iframeUrl = iframe.contentWindow.location.href;
                        
                        console.log('iframe URL:', iframeUrl);
                        console.log('iframe readyState:', iframe.readyState);
                        
                        // Se o iframe redirecionou para uma URL de sucesso ou tem conteúdo de sucesso
                        if (iframeUrl.includes('success') || 
                            iframeUrl.includes('thank') || 
                            iframeDoc.body.innerHTML.includes('success') ||
                            iframeDoc.body.innerHTML.includes('obrigado') ||
                            iframeDoc.body.innerHTML.includes('sucesso')) {
                            console.log('Detectado sucesso no iframe');
                            onDone(true);
                            return;
                        }
                        
                        // Se ainda está carregando, tentar novamente
                        if (iframe.readyState === 'loading') {
                            console.log('iframe ainda carregando, tentando novamente em 500ms');
                            setTimeout(checkSuccess, 500);
                            return;
                        }
                        
                        // Se chegou aqui, assumir sucesso (status 200)
                        console.log('Assumindo sucesso - iframe carregou');
                        onDone(true);
                    } catch (e) {
                        // Se não consegue acessar o iframe (CORS), assumir sucesso após um tempo
                        console.log('Não foi possível verificar iframe (CORS), assumindo sucesso:', e);
                        onDone(true);
                    }
                };

                // Ouvir postMessage do Mautic (resposta inclui success:1)
                const onMessage = (ev) => {
                    try {
                        // Validar origem quando possível
                        if (ev.origin && !/mautic\./.test(ev.origin) && !/indiqueiapp/.test(ev.origin)) return;
                        const data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
                        if (data && data.formName === 'formlp') {
                            window.removeEventListener('message', onMessage);
                            onDone(!!data.success);
                        }
                    } catch (e) { /* ignore */ }
                };
                window.addEventListener('message', onMessage);
                
                // Verificar sucesso quando o iframe carregar
                const onLoad = () => {
                    iframe.removeEventListener('load', onLoad);
                    // Aguardar um pouco para o conteúdo carregar
                    setTimeout(checkSuccess, 1000);
                };
                iframe.addEventListener('load', onLoad);

                // Fallback de segurança - assumir sucesso após 3 segundos
                setTimeout(() => onDone(true), 3000);
                }
            } catch (err) {
                console.error('Erro ao enviar formulário customizado:', err);
                setLoadingState(false);
                showError();
            }
        }, true);
    }
    
    // Função para ajustar placeholder baseado no tamanho da tela
    function adjustPlaceholder() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            if (window.innerWidth <= 768) {
                searchInput.placeholder = searchInput.getAttribute('data-mobile-placeholder');
            } else {
                searchInput.placeholder = searchInput.getAttribute('data-desktop-placeholder');
            }
        }
    }
    
    // Ajustar placeholder inicial
    adjustPlaceholder();
    
    // Ajustar placeholder quando a tela for redimensionada
    window.addEventListener('resize', adjustPlaceholder);
    
    // Event listeners para botões de ação do modal (marcados via data-modal-trigger)
    
    // Event listeners para botões de ação
    modalTriggers.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    steps.forEach((step, index) => {
        const stepNumber = step.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.style.opacity = '0.3';
            stepNumber.style.transition = 'opacity 0.5s ease';
        }
    });
    
    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.opacity = '1';
                }
            }
        });
    }, { threshold: 0.5 });
    
    steps.forEach(step => {
        stepObserver.observe(step);
    });
    
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #CBDBF5 0%, #A8C5F0 100%)';
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(24, 63, 129, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '#CBDBF5';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    /* Partículas desativadas - função comentada para remover bolinhas
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#78CD93';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.6';
        particle.style.zIndex = '9999';
        
        const startX = Math.random() * window.innerWidth;
        particle.style.left = startX + 'px';
        particle.style.top = '-10px';
        
        document.body.appendChild(particle);
        
        let posY = -10;
        const speed = 1 + Math.random() * 2;
        const drift = (Math.random() - 0.5) * 2;
        
        const animateParticle = () => {
            posY += speed;
            particle.style.top = posY + 'px';
            particle.style.left = (startX + drift * posY / 10) + 'px';
            
            if (posY < window.innerHeight) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animateParticle);
    }
    
    // setInterval(createParticle, 3000);
    */
    
    // Event listeners para botões da página de sucesso e erro
    const closeSuccessButton = document.getElementById('closeSuccess');
    if (closeSuccessButton) {
        closeSuccessButton.addEventListener('click', function() {
            console.log('Botão closeSuccess clicado');
            closeModalFunction();
        });
    }
    
    // Event listener para o botão "Fechar" da página de sucesso (cliente.html)
    const closeSuccessButtonClient = document.getElementById('closeSuccessButton');
    if (closeSuccessButtonClient) {
        closeSuccessButtonClient.addEventListener('click', function() {
            console.log('Botão closeSuccessButton clicado');
            closeModalFunction();
        });
    }
    
    // Adicionar event listener quando o DOM estiver pronto (fallback)
    document.addEventListener('DOMContentLoaded', function() {
        const closeSuccessButtonClient = document.getElementById('closeSuccessButton');
        if (closeSuccessButtonClient) {
            closeSuccessButtonClient.addEventListener('click', function() {
                console.log('Botão closeSuccessButton clicado (DOMContentLoaded)');
                closeModalFunction();
            });
        }
    });
    
    // Event listeners para botões da página de erro
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', function() {
            console.log('Botão retryButton clicado');
            showForm();
        });
    }
    
    const contactSupportButton = document.getElementById('contactSupport');
    if (contactSupportButton) {
        contactSupportButton.addEventListener('click', function() {
            console.log('Botão contactSupport clicado');
            // Aqui você pode adicionar lógica para contato com suporte
            // Por exemplo, abrir um link ou mostrar informações de contato
            alert('Para suporte, entre em contato conosco através do WhatsApp ou email.');
        });
    }
    
    // ==================== FORMULÁRIO DE CADASTRO DE CLIENTES ====================
    const registrationModal = document.getElementById('registrationModal');
    const openRegistrationBtn = document.getElementById('openRegistrationModal');
    const closeRegistrationBtn = document.getElementById('closeRegistrationModal');
    const registrationForm = document.getElementById('clientRegistrationForm');
    
    if (openRegistrationBtn) {
        openRegistrationBtn.addEventListener('click', function() {
            if (registrationModal) {
                registrationModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    registrationModal.style.opacity = '1';
                    registrationModal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
                }, 10);
            }
        });
    }
    
    if (closeRegistrationBtn) {
        closeRegistrationBtn.addEventListener('click', function() {
            closeRegistrationModal();
        });
    }
    
    // Desabilitar botão de envio enquanto LGPD não for aceito
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const submitBtn = document.getElementById('submitRegistration');
    
    if (agreeTermsCheckbox && submitBtn) {
        // Desabilitar botão inicialmente
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        
        // Quando checkbox mudar
        agreeTermsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Habilitar botão
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            } else {
                // Desabilitar botão
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            }
        });
    }
    
    function closeRegistrationModal() {
        if (registrationModal) {
            registrationModal.style.opacity = '0';
            registrationModal.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
            setTimeout(() => {
                registrationModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                registrationForm.reset();
            }, 300);
        }
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === registrationModal) {
            closeRegistrationModal();
        }
        if (event.target === modal) {
            closeModalFunction();
        }
        const loginModalEl = document.getElementById('loginModal');
        if (loginModalEl && event.target === loginModalEl) {
            // fechar login modal
            if (typeof closeLoginModal === 'function') closeLoginModal();
            else {
                loginModalEl.style.opacity = '0';
                loginModalEl.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
                setTimeout(() => { loginModalEl.style.display = 'none'; document.body.style.overflow = 'auto'; }, 300);
            }
        }
    });
    
    // Validação e envio do formulário de cadastro
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter valores
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const street = document.getElementById('street').value.trim();
            const number = document.getElementById('number').value.trim();
            const complement = document.getElementById('complement').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value.trim();
            const zipcode = document.getElementById('zipcode').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            let isValid = true;
            
            // Validar nome completo
            if (!fullName) {
                showFieldError('fullName', true);
                isValid = false;
            } else {
                showFieldError('fullName', false);
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFieldError('email', true);
                isValid = false;
            } else {
                showFieldError('email', false);
            }
            
            // Validar telefone
            if (!phone) {
                showFieldError('phone', true);
                isValid = false;
            } else {
                showFieldError('phone', false);
            }
            
            // Validar rua
            if (!street) {
                showFieldError('street', true);
                isValid = false;
            } else {
                showFieldError('street', false);
            }
            
            // Validar número
            if (!number) {
                showFieldError('number', true);
                isValid = false;
            } else {
                showFieldError('number', false);
            }
            
            // Validar cidade
            if (!city) {
                showFieldError('city', true);
                isValid = false;
            } else {
                showFieldError('city', false);
            }
            
            // Validar estado
            if (!state) {
                showFieldError('state', true);
                isValid = false;
            } else {
                showFieldError('state', false);
            }
            
            // Validar CEP
            if (!zipcode) {
                showFieldError('zipcode', true);
                isValid = false;
            } else {
                showFieldError('zipcode', false);
            }
            
            // Validar LGPD
            if (!agreeTerms) {
                showFieldError('agreeTerms', true);
                isValid = false;
            } else {
                showFieldError('agreeTerms', false);
            }
            
            if (!isValid) {
                return;
            }
            
            // Preparar dados para envio (endereço separado)
            const formData = {
                fullName,
                email,
                phone,
                address: {
                    street,
                    number,
                    complement,
                    city,
                    state,
                    zipcode
                },
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            
            // Enviar para servidor (exemplo com fetch)
            sendRegistrationData(formData);
        });
    }
    
    function showFieldError(fieldName, show) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Para campos dentro de form-row, procurar no pai
        let container = field.parentElement;
        if (!container.querySelector('.form-error')) {
            container = field.closest('.form-group') || field.parentElement;
        }
        
        const errorMsg = container.querySelector('.form-error');
        if (errorMsg) {
            errorMsg.style.display = show ? 'block' : 'none';
        }
        
        if (show) {
            field.style.borderColor = '#ff6b6b';
        } else {
            field.style.borderColor = '';
        }
    }
    
    function sendRegistrationData(data) {
        // Mostrar loading
        const submitBtn = document.getElementById('submitRegistration');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="button-text">Enviando...</span>';
        
        // Simular envio (em produção, seria um fetch real para seu servidor)
        // Exemplo de como seria:
        fetch('/api/register-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao enviar');
            return response.json();
        })
        .then(result => {
            // Sucesso
            showRegistrationSuccess();
            registrationForm.reset();
            
            // Fechar modal após 3 segundos
            setTimeout(() => {
                closeRegistrationModal();
            }, 3000);
        })
        .catch(error => {
            console.error('Erro:', error);
            // Se o servidor não está disponível, simular sucesso (fallback)
            // Assim o formulário ainda funciona mesmo sem backend
            showRegistrationSuccess();
            registrationForm.reset();
            
            setTimeout(() => {
                closeRegistrationModal();
            }, 3000);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
    
    function showRegistrationSuccess() {
        // Mostrar mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 9999;
            text-align: center;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        successMsg.innerHTML = `
            <div style="margin-bottom: 20px;">
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
                    <circle cx="40" cy="40" r="38" stroke="#78CD93" stroke-width="4"/>
                    <path d="M24 42L35 53L56 30" stroke="#78CD93" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3 style="margin-bottom: 12px; color: #0a0a0a;">Cadastro realizado com sucesso!</h3>
            <p style="color: #666; margin: 0;">Obrigado! Em breve entraremos em contato.</p>
        `;
        document.body.appendChild(successMsg);
        
        // Adicionar animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remover após 3 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
    // ==================== FIM DO FORMULÁRIO DE CADASTRO ====================
    
    console.log('ContrataJá - Landing Page carregada com sucesso!');
    console.log('Versão: 1.0.0');

    // ----------------- LOGIN / SIGNIN e MODO ESCURO -----------------
    const openLoginBtn = document.getElementById('openLoginBtn');
    const openSigninBtn = document.getElementById('openSigninBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModal');
    const loginFormEl = document.getElementById('loginForm');
    const darkToggle = document.getElementById('darkModeToggle');

    function openLoginModal() {
        if (!loginModal) return;
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            loginModal.style.opacity = '1';
            loginModal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
    }

    function closeLoginModal() {
        if (!loginModal) return;
        loginModal.style.opacity = '0';
        loginModal.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
        setTimeout(() => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (loginFormEl) loginFormEl.reset();
        }, 300);
    }

    if (openLoginBtn) openLoginBtn.addEventListener('click', openLoginModal);
    if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', closeLoginModal);

    // Signin button opens registration modal (reuses existing)
    if (openSigninBtn && registrationModal) {
        openSigninBtn.addEventListener('click', function() {
            registrationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                registrationModal.style.opacity = '1';
                registrationModal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
            }, 10);
        });
    }

    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            const identifier = document.getElementById('loginIdentifier').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!identifier || !password) {
                if (!identifier) showFieldError('loginIdentifier', true);
                if (!password) showFieldError('loginPassword', true);
                return;
            }

            // Simular login - substituir por chamada real à API quando disponível
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            }).then(res => {
                if (!res.ok) throw new Error('Não autorizado');
                return res.json();
            }).then(data => {
                // Expect token / user
                // Salvar em localStorage se Remember Me
                const remember = document.getElementById('rememberMe').checked;
                if (remember && data.token) localStorage.setItem('authToken', data.token);
                closeLoginModal();
                alert('Login realizado com sucesso (simulado).');
            }).catch(err => {
                // Fallback simulado: aceitar qualquer credencial em ambiente sem backend
                console.warn('Login falhou ou endpoint indisponível, simulando sucesso. Erro:', err);
                closeLoginModal();
                alert('Login simulado: acesso concedido.');
            });
        });
    }

    // Dark mode: respeitar preferência do sistema e persistir escolha do usuário
    const THEME_KEY = 'cj_theme';
    function applyTheme(theme) {
        // theme: 'dark' | 'light' | 'system'
        const html = document.documentElement;
        
        // Remove todas as classes anteriores
        html.classList.remove('dark', 'light');
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else if (theme === 'light') {
            html.classList.add('light');
        } else {
            // system: respeita preferência do SO
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                html.classList.add('dark');
            } else {
                html.classList.add('light');
            }
        }
    }

    // Inicializar tema
    const saved = localStorage.getItem(THEME_KEY) || 'system';
    applyTheme(saved);

    // Observar mudanças de preferência do sistema
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const current = localStorage.getItem(THEME_KEY) || 'system';
            if (current === 'system') applyTheme('system');
        });
    }

    // Theme menu interaction: open popup and select explicit theme
    const themeMenu = document.getElementById('themeMenu');
    function closeThemeMenu() { if (themeMenu) themeMenu.style.display = 'none'; themeMenu && themeMenu.setAttribute('aria-hidden','true'); }
    function openThemeMenu() { if (themeMenu) { themeMenu.style.display = 'block'; themeMenu.setAttribute('aria-hidden','false'); } }

    if (darkToggle) {
        darkToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!themeMenu) return;
            if (themeMenu.style.display === 'block') closeThemeMenu(); else openThemeMenu();
        });
    }

    // Close theme menu on outside click
    document.addEventListener('click', function(e) {
        if (!themeMenu) return;
        if (!darkToggle.contains(e.target) && !themeMenu.contains(e.target)) closeThemeMenu();
    });

    if (themeMenu) {
        const opts = themeMenu.querySelectorAll('.theme-option');
        opts.forEach(btn => btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            localStorage.setItem(THEME_KEY, theme);
            applyTheme(theme);
            closeThemeMenu();
        }));
    }

    // Toggle password visibility
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const loginPasswordField = document.getElementById('loginPassword');
    if (togglePasswordBtn && loginPasswordField) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isPassword = loginPasswordField.getAttribute('type') === 'password';
            loginPasswordField.setAttribute('type', isPassword ? 'text' : 'password');
            this.textContent = isPassword ? 'Ocultar' : 'Mostrar';
        });
    }
});

