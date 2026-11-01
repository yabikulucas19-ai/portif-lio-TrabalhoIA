/**
 * ==========================================================================
 * PORTFÓLIO - LUCAS M YABIKU
 * Interatividade Pura (Vanilla JS)
 * 
 * Módulos:
 * 1. Cursor de Mira (Reticle Target)
 * 2. Canvas de Linhas Conectadas & Palavras Flutuantes (Seunghyuk Kim)
 * 3. Menu Radial Persona 5 com Shards e Efeito de Foco
 * 4. Facho de Luz Triangular / Spotlight na Seção Sobre
 * 5. Barra de Batalha no Rodapé (HUD) & Atalhos de Teclado
 * 6. Transição Diagonal Vermelha (Persona 5 Wipe)
 * 7. Cópia de E-mail e Alternador de Tema
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CURSOR DE MIRA PERSONALIZADO (P5 TARGET RETICLE)
       ========================================================================== */
    const cursor = document.getElementById('customCursor');
    const cursorLabel = document.getElementById('cursorLabel');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        const ease = 0.22;
        curX += (mouseX - curX) * ease;
        curY += (mouseY - curY) * ease;

        if (cursor) {
            cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Detecção de elementos interativos com mira vermelha
    const interactiveTargets = document.querySelectorAll('a, button, .p5-menu-item, .tech-chip, .p5-project-card, .p5-chip-card, .mission-dossier-card, .p5-cta-btn, .nav-back-link');
    interactiveTargets.forEach((target) => {
        target.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-target');
            if (cursorLabel) {
                const label = target.getAttribute('data-label') || 
                              target.querySelector('.item-title')?.textContent || 
                              target.querySelector('.btn-text')?.textContent || 
                              target.querySelector('.tape-category')?.textContent || 
                              target.querySelector('.hud-label')?.textContent || 
                              'VER';
                cursorLabel.textContent = label.trim().substring(0, 14).toUpperCase();
            }
        });

        target.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-target');
        });
    });


    /* ==========================================================================
       2. TRANSIÇÃO DE TELA DIAGONAL (PERSONA 5 WIPE) ENTRE PÁGINAS
       ========================================================================== */
    const pageWipe = document.getElementById('pageWipe');
    let isTransitioning = false;

    // Transição de entrada suave ao carregar a página
    if (pageWipe) {
        // Se veio de outra página através do wipe, remove a cobertura suavemente
        pageWipe.classList.add('animating-in');
        setTimeout(() => {
            pageWipe.classList.remove('animating-in');
        }, 500);
    }

    function triggerPageTransition(targetUrl) {
        if (isTransitioning || !targetUrl) return;
        isTransitioning = true;

        if (pageWipe) {
            pageWipe.classList.remove('animating-in');
            pageWipe.classList.remove('animating-out');
            void pageWipe.offsetWidth; // Força reflow
            pageWipe.classList.add('animating-out');
        }

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 340);
    }

    // Intercepta links com data-nav-page ou links para páginas do portfólio
    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        const navPage = link.getAttribute('data-nav-page') || href;

        // Se for link para uma das páginas internas do site
        if (navPage && (navPage.endsWith('.html') || navPage === 'index.html')) {
            link.addEventListener('click', (e) => {
                // Não intercepta se for tecla modificadora (ctrl/cmd/shift)
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                triggerPageTransition(navPage);
            });
        }
    });


    /* ==========================================================================
       3. CANVAS DE LINHAS CONECTADAS E PALAVRAS FLUTUANTES (SEUNGHYUK KIM)
       ========================================================================== */
    const canvas = document.getElementById('p5LinesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Palavras de personalidade inspiradas no seunghyuk.com
        const personalityWords = [
            { text: 'PERSISTENTE', xRatio: 0.22, yRatio: 0.38, speed: 0.001 },
            { text: 'CTRL + Z', xRatio: 0.32, yRatio: 0.24, speed: 0.0012 },
            { text: 'COFFEE', xRatio: 0.76, yRatio: 0.36, speed: 0.0009 },
            { text: 'NOITE', xRatio: 0.68, yRatio: 0.72, speed: 0.0015 },
            { text: 'HARDWARE', xRatio: 0.28, yRatio: 0.65, speed: 0.0011 },
            { text: 'FOCUS', xRatio: 0.74, yRatio: 0.22, speed: 0.0013 },
            { text: 'TI // 2026', xRatio: 0.42, yRatio: 0.78, speed: 0.0008 },
            { text: 'PRECISION', xRatio: 0.62, yRatio: 0.28, speed: 0.001 }
        ];

        let centerLerpX = width / 2;
        let centerLerpY = height / 2;
        let tick = 0;

        function animateHeroLines() {
            ctx.clearRect(0, 0, width, height);
            tick += 0.015;

            // Ponto central segue o cursor com peso (inércia)
            const targetCenterX = width / 2 + (mouseX - width / 2) * 0.08;
            const targetCenterY = height / 2 + (mouseY - height / 2) * 0.08;
            centerLerpX += (targetCenterX - centerLerpX) * 0.1;
            centerLerpY += (targetCenterY - centerLerpY) * 0.1;

            // Coleta a posição das 4 opções do menu radial
            const menuItems = [
                { el: document.getElementById('menuItemSobre'), name: 'sobre' },
                { el: document.getElementById('menuItemProjetos'), name: 'projetos' },
                { el: document.getElementById('menuItemContato'), name: 'contato' },
                { el: document.getElementById('menuItemInicio'), name: 'inicio' }
            ];

            let closestItem = null;
            let minDistance = Infinity;

            const targets = [];
            menuItems.forEach((item) => {
                if (item.el) {
                    const rect = item.el.getBoundingClientRect();
                    const itemCenterX = rect.left + rect.width / 2;
                    const itemCenterY = rect.top + rect.height / 2;
                    const distToMouse = Math.hypot(mouseX - itemCenterX, mouseY - itemCenterY);

                    targets.push({ x: itemCenterX, y: itemCenterY, el: item.el });

                    if (distToMouse < minDistance) {
                        minDistance = distToMouse;
                        closestItem = item.el;
                    }
                }
            });

            // 1. Linhas até as opções do menu
            targets.forEach((tgt) => {
                const isClosest = (tgt.el === closestItem);
                ctx.beginPath();
                ctx.moveTo(centerLerpX, centerLerpY);
                ctx.lineTo(tgt.x, tgt.y);

                if (isClosest) {
                    ctx.strokeStyle = 'rgba(230, 0, 18, 0.75)';
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                    ctx.lineWidth = 0.8;
                }
                ctx.stroke();
            });

            // 2. Palavras de personalidade com linhas tênues
            ctx.font = '10px "Space Mono", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';

            personalityWords.forEach((pw, idx) => {
                const driftX = Math.sin(tick + idx) * 8;
                const driftY = Math.cos(tick + idx * 0.8) * 8;
                const px = width * pw.xRatio + driftX;
                const py = height * pw.yRatio + driftY;

                // Linha fina partindo do centro até a palavra
                ctx.beginPath();
                ctx.moveTo(centerLerpX, centerLerpY);
                ctx.lineTo(px, py);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Desenha a palavra
                ctx.fillText(pw.text, px + 4, py - 4);
                // Pequeno marcador
                ctx.fillRect(px - 1, py - 1, 3, 3);
            });

            requestAnimationFrame(animateHeroLines);
        }
        animateHeroLines();
    }


    /* ==========================================================================
       4. ESTILHAÇOS DE BATALHA & EFEITO 3D NA SILHUETA
       ========================================================================== */
    const menuItems = document.querySelectorAll('.p5-menu-item');
    const shards = document.querySelectorAll('.p5-shard');
    const characterImg = document.getElementById('characterImg');

    menuItems.forEach((item) => {
        const shardId = item.getAttribute('data-shard');
        const targetShard = document.getElementById(shardId);

        item.addEventListener('mouseenter', () => {
            if (targetShard) {
                targetShard.classList.add('active-shard');
            }
        });

        item.addEventListener('mouseleave', () => {
            shards.forEach(s => s.classList.remove('active-shard'));
        });
    });

    // Tilt 3D suave na silhueta com movimento do mouse
    window.addEventListener('mousemove', (e) => {
        if (!characterImg) return;
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        characterImg.style.transform = `perspective(800px) rotateY(${normX * 12}deg) rotateX(${-normY * 8}deg)`;
    });


    /* ==========================================================================
       5. SISTEMA CINEMATOGRÁFICO DE SPOTLIGHT & LUMINÁRIA (SEÇÃO SOBRE)
       Luminária física suspensa que acompanha integralmente as coordenadas X e Y
       ========================================================================== */
    const spotlightLamp = document.getElementById('spotlightLamp');
    const lampHead = document.getElementById('spotlightLampHead');
    const lightField = document.getElementById('spotlightLightField');
    const spotlightTargets = document.querySelectorAll('[data-spotlight-target]');

    if (spotlightLamp && lightField && lampHead) {
        // Coordenadas iniciais de repouso no centro da viewport
        let pointerX = window.innerWidth / 2;
        let pointerY = window.innerHeight * 0.45;

        // Configurações de raio e opacidade adaptadas à resolução
        function getSpotlightSettings() {
            const isTouchOrCompact = window.innerWidth <= 1024;
            return {
                isMobile: isTouchOrCompact,
                defaultRadiusX: isTouchOrCompact ? Math.min(window.innerWidth * 0.85, 360) : 420,
                defaultRadiusY: isTouchOrCompact ? 270 : 320,
                fieldOpacity: isTouchOrCompact ? 0.65 : 0.96,
                beamOpacity: isTouchOrCompact ? 0.78 : 0.85
            };
        }

        let spotSettings = getSpotlightSettings();

        // Posição física da lâmpada suspensa
        let lampTargetX = pointerX;
        let lampTargetY = Math.max(50, pointerY - (spotSettings.isMobile ? 90 : 130));
        let lampCurrentX = lampTargetX;
        let lampCurrentY = lampTargetY;
        let prevLampX = lampCurrentX;

        // Ponto focal e dimensões da iluminação no chão/conteúdo
        let spotTargetX = pointerX;
        let spotTargetY = pointerY;
        let spotCurrentX = spotTargetX;
        let spotCurrentY = spotTargetY;

        let defaultRadiusX = spotSettings.defaultRadiusX;
        let defaultRadiusY = spotSettings.defaultRadiusY;
        let spotTargetRadiusX = defaultRadiusX;
        let spotTargetRadiusY = defaultRadiusY;
        let spotCurrentRadiusX = defaultRadiusX;
        let spotCurrentRadiusY = defaultRadiusY;

        // Ângulo pendular de inércia da cúpula
        let currentAngle = 0;
        let targetAngle = 0;

        let targetFieldOpacity = spotSettings.fieldOpacity;
        let currentFieldOpacity = spotSettings.fieldOpacity;
        let targetBeamOpacity = spotSettings.beamOpacity;
        let currentBeamOpacity = spotSettings.beamOpacity;

        let activeTargetElement = null;

        function updateBounds() {
            spotSettings = getSpotlightSettings();
            defaultRadiusX = spotSettings.defaultRadiusX;
            defaultRadiusY = spotSettings.defaultRadiusY;

            if (!activeTargetElement) {
                lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, pointerX));
                lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, pointerY - (spotSettings.isMobile ? 90 : 130)));
                spotTargetX = pointerX;
                spotTargetY = pointerY;
                spotTargetRadiusX = defaultRadiusX;
                spotTargetRadiusY = defaultRadiusY;
                targetFieldOpacity = spotSettings.fieldOpacity;
                targetBeamOpacity = spotSettings.beamOpacity;
            }
        }
        window.addEventListener('resize', updateBounds);

        // Foco magnético em elemento selecionado (mouse, toque ou teclado)
        function focusSpotlightOn(element) {
            if (!element) return;
            activeTargetElement = element;

            spotlightTargets.forEach(el => el.classList.remove('spotlight-active-target'));
            element.classList.add('spotlight-active-target');

            const rect = element.getBoundingClientRect();
            spotTargetX = rect.left + rect.width / 2;
            spotTargetY = rect.top + rect.height / 2;

            const isCompact = window.innerWidth <= 1024;
            lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, spotTargetX));
            lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, rect.top - (isCompact ? 80 : 110)));

            // Ajusta o facho suavemente às dimensões do elemento com proporção responsiva
            spotTargetRadiusX = Math.max(isCompact ? 200 : 300, (rect.width / 2) + (isCompact ? 70 : 140));
            spotTargetRadiusY = Math.max(isCompact ? 160 : 220, (rect.height / 2) + (isCompact ? 50 : 100));

            targetFieldOpacity = isCompact ? 0.60 : 0.96;
            targetBeamOpacity = isCompact ? 0.80 : 0.92;
        }

        // Retorna a lâmpada ao rastreamento livre do cursor ou toque
        function releaseSpotlight() {
            activeTargetElement = null;
            spotlightTargets.forEach(el => el.classList.remove('spotlight-active-target'));

            const isCompact = window.innerWidth <= 1024;
            lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, pointerX));
            lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, pointerY - (isCompact ? 90 : 130)));

            spotTargetX = pointerX;
            spotTargetY = pointerY;

            spotTargetRadiusX = defaultRadiusX;
            spotTargetRadiusY = defaultRadiusY;

            targetFieldOpacity = spotSettings.fieldOpacity;
            targetBeamOpacity = spotSettings.beamOpacity;
        }

        // Atualização de coordenadas de ponteiro comum para mouse e toque
        function handlePointerPosition(clientX, clientY, isDirectDrag = false) {
            pointerX = clientX;
            pointerY = clientY;

            if (!activeTargetElement || isDirectDrag) {
                const isCompact = window.innerWidth <= 1024;
                lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, pointerX));
                lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, pointerY - (isCompact ? 90 : 130)));

                spotTargetX = pointerX;
                spotTargetY = pointerY;
            }
        }

        // Rastreamento contínuo do mouse em desktop
        window.addEventListener('mousemove', (e) => {
            handlePointerPosition(e.clientX, e.clientY);
        });

        // Atualização tátil dedicada para toque e arrasto de dedo no celular/tablet
        function updateTouchPointer(clientX, clientY) {
            pointerX = clientX;
            pointerY = clientY;

            const isCompact = window.innerWidth <= 1024;
            lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, pointerX));
            lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, pointerY - (isCompact ? 90 : 130)));
            spotTargetX = pointerX;
            spotTargetY = pointerY;

            // Ilumina ativamente o elemento sob o dedo
            const elUnder = document.elementFromPoint(clientX, clientY);
            const targetUnder = elUnder ? elUnder.closest('[data-spotlight-target]') : null;

            if (targetUnder) {
                if (activeTargetElement !== targetUnder) {
                    activeTargetElement = targetUnder;
                    spotlightTargets.forEach(el => el.classList.remove('spotlight-active-target'));
                    targetUnder.classList.add('spotlight-active-target');
                }
            } else if (activeTargetElement) {
                activeTargetElement = null;
                spotlightTargets.forEach(el => el.classList.remove('spotlight-active-target'));
            }
        }

        // Suporte a toque contínuo em celulares/tablets sem interferir no scroll
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                updateTouchPointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                updateTouchPointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        // Suporte unificado via Pointer Events (toque, caneta e trackpad táctil)
        window.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                updateTouchPointer(e.clientX, e.clientY);
            }
        }, { passive: true });

        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                updateTouchPointer(e.clientX, e.clientY);
            }
        }, { passive: true });

        // Sincronização dinâmica da iluminação com a rolagem vertical da página
        window.addEventListener('scroll', () => {
            if (activeTargetElement) {
                const rect = activeTargetElement.getBoundingClientRect();
                // Se o elemento saiu da viewport, libera para não prender o foco fora da tela
                if (rect.bottom < 40 || rect.top > window.innerHeight - 40) {
                    releaseSpotlight();
                } else {
                    spotTargetX = rect.left + rect.width / 2;
                    spotTargetY = rect.top + rect.height / 2;
                    const isCompact = window.innerWidth <= 1024;
                    lampTargetX = Math.max(30, Math.min(window.innerWidth - 30, spotTargetX));
                    lampTargetY = Math.max(50, Math.min(window.innerHeight - 100, rect.top - (isCompact ? 80 : 110)));
                }
            } else if (window.innerWidth <= 1024) {
                // Em dispositivos móveis e tablets, durante a rolagem ilumina suavemente o card mais central
                const centerY = window.innerHeight * 0.45;
                let closest = null;
                let minDistance = Infinity;
                spotlightTargets.forEach(target => {
                    const r = target.getBoundingClientRect();
                    const dist = Math.abs((r.top + r.height / 2) - centerY);
                    if (dist < minDistance && r.bottom > 80 && r.top < window.innerHeight - 80) {
                        minDistance = dist;
                        closest = target;
                    }
                });
                if (closest && minDistance < 220) {
                    focusSpotlightOn(closest);
                }
            }
        }, { passive: true });

        // Conexão dos eventos com cada alvo interativo (mouse e teclado)
        spotlightTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => focusSpotlightOn(target));
            target.addEventListener('mouseleave', () => {
                if (document.activeElement !== target) {
                    releaseSpotlight();
                }
            });

            target.addEventListener('focus', () => focusSpotlightOn(target));
            target.addEventListener('blur', () => releaseSpotlight());
        });

        // Loop Principal de Física e Interpolação Suave (60 FPS)
        function renderCinematicSpotlight() {
            const ease = 0.085;

            // Interpolação fluida da posição da luminária (X e Y)
            lampCurrentX += (lampTargetX - lampCurrentX) * ease;
            lampCurrentY += (lampTargetY - lampCurrentY) * ease;

            // Interpolação do ponto de luz no conteúdo
            spotCurrentX += (spotTargetX - spotCurrentX) * ease;
            spotCurrentY += (spotTargetY - spotCurrentY) * ease;

            // Dimensões elípticas do foco
            spotCurrentRadiusX += (spotTargetRadiusX - spotCurrentRadiusX) * ease;
            spotCurrentRadiusY += (spotTargetRadiusY - spotCurrentRadiusY) * ease;

            // Opacidades do facho e da penumbra
            currentFieldOpacity += (targetFieldOpacity - currentFieldOpacity) * ease;
            currentBeamOpacity += (targetBeamOpacity - currentBeamOpacity) * ease;

            // Inércia pendular realista na cúpula da lâmpada ao se deslocar lateralmente
            const velocityX = lampCurrentX - prevLampX;
            prevLampX = lampCurrentX;

            targetAngle = Math.max(-26, Math.min(26, velocityX * 2.2));
            currentAngle += (targetAngle - currentAngle) * 0.12;

            // Aplicação física direta nos elementos da luminária
            spotlightLamp.style.setProperty('--lamp-x', `${lampCurrentX.toFixed(1)}px`);
            spotlightLamp.style.setProperty('--lamp-wire-height', `${lampCurrentY.toFixed(1)}px`);

            lampHead.style.setProperty('--lamp-angle', `${currentAngle.toFixed(2)}deg`);
            lampHead.style.setProperty('--lamp-beam-opacity', currentBeamOpacity.toFixed(2));

            // Aplicação do facho de iluminação suave no campo cinematográfico
            lightField.style.setProperty('--spot-x', `${spotCurrentX.toFixed(1)}px`);
            lightField.style.setProperty('--spot-y', `${spotCurrentY.toFixed(1)}px`);
            lightField.style.setProperty('--spot-radius-x', `${spotCurrentRadiusX.toFixed(1)}px`);
            lightField.style.setProperty('--spot-radius-y', `${spotCurrentRadiusY.toFixed(1)}px`);
            lightField.style.setProperty('--spot-field-opacity', currentFieldOpacity.toFixed(2));

            requestAnimationFrame(renderCinematicSpotlight);
        }
        renderCinematicSpotlight();
    }


    /* ==========================================================================
       6. BARRA DE ATALHOS NO RODAPÉ (PERSONA 5 HUD) & ATALHOS DE TECLADO
       ========================================================================== */
    const sectionsSequence = ['inicio', 'sobre', 'projetos', 'contato'];
    let currentSectionIndex = 0;

    function getActiveSectionIndex() {
        const scrollY = window.scrollY + 200;
        sectionsSequence.forEach((secId, idx) => {
            const el = document.getElementById(secId);
            if (el) {
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    currentSectionIndex = idx;
                }
            }
        });
        return currentSectionIndex;
    }

    // Ações dos botões da HUD Bar
    document.querySelectorAll('.hud-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');

            switch (action) {
                case 'analyze': // Abre o Sobre
                    triggerSectionTransition('sobre');
                    break;
                case 'target': // Abre os Projetos
                    triggerSectionTransition('projetos');
                    break;
                case 'next-turn': // Avança para a próxima seção
                    const nextIdx = (getActiveSectionIndex() + 1) % sectionsSequence.length;
                    triggerSectionTransition(sectionsSequence[nextIdx]);
                    break;
                case 'rush': // Direto ao Contato
                    triggerSectionTransition('contato');
                    break;
                case 'assist': // Alterna Modo Claro/Escuro
                    toggleTheme();
                    break;
            }
        });
    });

    // Mapeamento de atalhos de teclado (Teclas ESC, A, T, R, S, 1, 2, 3, 4)
    window.addEventListener('keydown', (e) => {
        // Ignora se estiver digitando em campos de texto
        if (e.target.matches('input, textarea, select')) return;

        const key = e.key.toUpperCase();

        if (e.key === 'Escape' || key === '1') {
            triggerPageTransition('index.html');
        } else if (key === 'A' || key === '2') { // Analyze / Sobre
            triggerPageTransition('sobre.html');
        } else if (key === 'T' || key === '3') { // Target / Projetos
            triggerPageTransition('projetos.html');
        } else if (key === 'R' || key === '4') { // Rush / Contato
            triggerPageTransition('contato.html');
        } else if (key === 'S') { // Assist / Tema
            toggleTheme();
        }
    });


    /* ==========================================================================
       7. CÓPIA DE E-MAIL E ALTERNADOR DE TEMA
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    const emailToCopy = '41891@raphaeldisanto.com.br';

    if (copyEmailBtn && copyFeedback) {
        copyEmailBtn.addEventListener('click', async () => {
            const banner = copyEmailBtn.querySelector('.copy-banner');
            try {
                await navigator.clipboard.writeText(emailToCopy);
                copyFeedback.textContent = 'COPIADO COM SUCESSO! ✓';
                if (banner) {
                    banner.style.backgroundColor = '#ffffff';
                    banner.style.color = '#000000';
                    banner.style.borderColor = 'var(--color-red)';
                }

                setTimeout(() => {
                    copyFeedback.textContent = '';
                    if (banner) {
                        banner.style.backgroundColor = '';
                        banner.style.color = '';
                        banner.style.borderColor = '';
                    }
                }, 2800);
            } catch (err) {
                copyFeedback.textContent = 'SELECIONE E COPIE: 41891@raphaeldisanto.com.br';
            }
        });
    }

    // Gerenciamento de Tema (Claro / Escuro)
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lmy-p5-theme', newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const savedTheme = localStorage.getItem('lmy-p5-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);


    /* ==========================================================================
       8. ONDULAÇÕES LÍQUIDAS & REFRAÇÃO INTERATIVA EM TELA CHEIA (NOTHIN' INSPIRED)
       Exclusivo da Seção Contato
       ========================================================================== */
    const contactCanvas = document.getElementById('contactRainCanvas');
    const callingCardBox = document.getElementById('callingCardBox');
    const emailLink = document.getElementById('emailLink');
    const cardAmbientGlow = document.getElementById('cardLiquidAmbient');
    const liquidDisplacement = document.getElementById('liquidDisplacement');
    const liquidTurbulence = document.getElementById('liquidTurbulence');

    if (contactCanvas) {
        // Suporte resiliente a prefers-reduced-motion
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const MAX_RIPPLES = isReducedMotion ? 14 : 28;
        const SPEED_MULT = isReducedMotion ? 0.6 : 1.0;
        const MAX_DISPLACEMENT = isReducedMotion ? 6.0 : 22.0;

        const ctx = contactCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 1;

        // Redimensionamento para ocupar 100% da viewport visível (tela cheia)
        function resizeContactCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            contactCanvas.width = Math.round(width * dpr);
            contactCanvas.height = Math.round(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
        resizeContactCanvas();

        window.addEventListener('resize', resizeContactCanvas);
        window.addEventListener('load', resizeContactCanvas);
        if (document.fonts) {
            document.fonts.ready.then(resizeContactCanvas);
        }

        // Estado do cursor e variáveis dinâmicas de intensidade líquida
        let mouseX = width / 2;
        let mouseY = height / 2;
        let prevMouseX = mouseX;
        let prevMouseY = mouseY;
        let mouseVelocity = 0;
        let lastMouseMoveTime = 0;
        let isOverEmail = false;

        let liquidIntensity = 0;
        let targetIntensity = 0;

        let currentDisplacementScale = 0;
        let targetDisplacementScale = 0;
        let lastScaleApplied = -1;

        let burstDisplacementBoost = 0;
        let tick = 0;

        // Array de ondulações (ripples que se propagam livremente pela tela inteira)
        const ripples = [];

        // Classe para ondulação líquida circular em grande escala
        class WaterRipple {
            constructor(x, y, strength = 0.7, maxRadius = 320) {
                this.x = x;
                this.y = y;
                this.radius = 4;
                this.maxRadius = maxRadius;
                this.expansionRate = (3.0 + strength * 3.5) * SPEED_MULT;
                this.strength = strength;
                this.alpha = 0.9 * strength;
                this.dead = false;
            }

            update() {
                this.radius += this.expansionRate;
                this.expansionRate *= 0.982; // Desaceleração fluida da frente de onda
                this.alpha -= (isReducedMotion ? 0.005 : 0.0075); // Vida útil ampla para viajar pela tela

                if (this.radius >= this.maxRadius || this.alpha <= 0.01) {
                    this.dead = true;
                }
            }

            draw(context) {
                if (this.alpha <= 0) return;
                context.save();

                context.shadowColor = '#E60012';
                context.shadowBlur = 8;

                // 1. Corpo suave da água em deslocamento (massa translúcida)
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(230, 0, 18, ${(this.alpha * 0.035).toFixed(3)})`;
                context.fill();

                // 2. Anel primário externo (crista principal da onda)
                context.strokeStyle = `rgba(230, 0, 18, ${Math.min(0.95, this.alpha.toFixed(3))})`;
                context.lineWidth = Math.max(1.1, (3.2 * (1 - this.radius / this.maxRadius)).toFixed(2));
                context.stroke();

                // 3. Anel secundário concêntrico de tensão superficial
                if (this.radius > 10) {
                    const innerRadius = this.radius * 0.72;
                    context.beginPath();
                    context.arc(this.x, this.y, innerRadius, 0, Math.PI * 2);
                    context.strokeStyle = `rgba(255, 80, 80, ${(this.alpha * 0.72).toFixed(3)})`;
                    context.lineWidth = 1.3;
                    context.stroke();
                }

                // 4. Anel terciário de dispersão interna (profundidade aquática)
                if (this.radius > 30) {
                    const coreRadius = this.radius * 0.42;
                    context.beginPath();
                    context.arc(this.x, this.y, coreRadius, 0, Math.PI * 2);
                    context.strokeStyle = `rgba(230, 0, 18, ${(this.alpha * 0.42).toFixed(3)})`;
                    context.lineWidth = 0.9;
                    context.stroke();
                }

                context.restore();
            }
        }

        function createWaterRipple(x, y, strength, maxRadius) {
            if (ripples.length < MAX_RIPPLES) {
                ripples.push(new WaterRipple(x, y, strength, maxRadius));
            }
        }

        // Rastreamento do mouse em 100% da janela sem limites visuais
        function updateFullscreenMouse(clientX, clientY) {
            mouseX = clientX;
            mouseY = clientY;

            const dx = mouseX - prevMouseX;
            const dy = mouseY - prevMouseY;
            mouseVelocity = Math.hypot(dx, dy);

            prevMouseX = mouseX;
            prevMouseY = mouseY;
            lastMouseMoveTime = performance.now();

            if (emailLink) {
                const emailRect = emailLink.getBoundingClientRect();
                isOverEmail = (
                    clientX >= emailRect.left - 20 && clientX <= emailRect.right + 20 &&
                    clientY >= emailRect.top - 15 && clientY <= emailRect.bottom + 15
                );
            }

            // Gera ondulações expansivas ao mover o mouse por qualquer área da página
            if (mouseVelocity > (isReducedMotion ? 4.5 : 2.5)) {
                const spawnChance = isOverEmail ? 0.55 : 0.38;
                if (Math.random() < spawnChance) {
                    const dynamicRadius = 180 + Math.min(220, mouseVelocity * 7.0);
                    createWaterRipple(
                        mouseX,
                        mouseY,
                        Math.min(1.0, 0.45 + mouseVelocity * 0.03),
                        dynamicRadius
                    );
                }
            }
        }

        window.addEventListener('mousemove', (e) => {
            updateFullscreenMouse(e.clientX, e.clientY);
        });

        // Suporte a toque em qualquer área do dispositivo móvel
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                updateFullscreenMouse(touchX, touchY);
                createWaterRipple(touchX, touchY, 1.0, 260);
                burstDisplacementBoost = 6.0;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                updateFullscreenMouse(touchX, touchY);
                if (Math.random() < 0.45) {
                    createWaterRipple(touchX, touchY, 0.75, 180);
                }
            }
        }, { passive: true });

        // Feedback de clique/impacto: ondas expansivas que viajam por toda a tela
        function triggerWaterSplash(e) {
            const clickX = e.clientX;
            const clickY = e.clientY;

            createWaterRipple(clickX, clickY, 1.0, 480);
            setTimeout(() => createWaterRipple(clickX, clickY, 0.85, 340), 90);
            setTimeout(() => createWaterRipple(clickX, clickY, 0.55, 200), 180);

            burstDisplacementBoost = 12.0;
        }

        // Cliques no card, botões e na tela produzem ondas amplas
        window.addEventListener('click', triggerWaterSplash);

        // Loop de Animação Principal (60 FPS via requestAnimationFrame)
        function animateLiquidSurface() {
            tick += (isReducedMotion ? 0.015 : 0.03);
            const now = performance.now();
            const isRecentMotion = (now - lastMouseMoveTime) < 200;

            // Limpeza completa do Canvas em tela cheia
            ctx.clearRect(0, 0, width, height);

            // Atualização e renderização das ondas
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i];
                ripple.update();
                ripple.draw(ctx);
                if (ripple.dead) {
                    ripples.splice(i, 1);
                }
            }

            // Calcula a intensidade das ondas ativas passando pela tela
            let wavePassingEnergy = 0;
            for (let i = 0; i < ripples.length; i++) {
                const rip = ripples[i];
                const waveProgress = rip.radius / rip.maxRadius;
                // Onda sinusoidal de pico enquanto a frente de onda se propaga
                const waveFront = Math.sin(waveProgress * Math.PI);
                wavePassingEnergy += rip.alpha * rip.strength * waveFront;
            }

            const motionFactor = Math.min(1, mouseVelocity / 18);
            targetIntensity = (wavePassingEnergy > 0.05 || isRecentMotion) ? Math.min(1.0, 0.45 + motionFactor * 0.4 + wavePassingEnergy * 0.5) : 0;
            liquidIntensity += (targetIntensity - liquidIntensity) * 0.08;

            // Iluminação reflexiva suave no card quando perto dele
            if (cardAmbientGlow && callingCardBox) {
                const rect = callingCardBox.getBoundingClientRect();
                const localX = mouseX - rect.left;
                const localY = mouseY - rect.top;
                callingCardBox.style.setProperty('--liquid-mouse-x', `${localX.toFixed(1)}px`);
                callingCardBox.style.setProperty('--liquid-mouse-y', `${localY.toFixed(1)}px`);
                cardAmbientGlow.style.opacity = (liquidIntensity * 0.85).toFixed(3);
            }

            // Distorção e refração líquida em tela cheia (100% da viewport)
            if (liquidDisplacement && liquidTurbulence) {
                if (burstDisplacementBoost > 0) {
                    burstDisplacementBoost *= 0.92;
                    if (burstDisplacementBoost < 0.05) burstDisplacementBoost = 0;
                }

                // Intensidade elevada da refração proporcional à passagem das ondas
                const baseScale = (wavePassingEnergy * 10.5) + (motionFactor * 5.0) + (isOverEmail ? 4.0 : 0) + burstDisplacementBoost;
                targetDisplacementScale = Math.min(MAX_DISPLACEMENT, baseScale);

                // Interpolação suave: os textos deformam com as ondas e retornam à posição original
                currentDisplacementScale += (targetDisplacementScale - currentDisplacementScale) * 0.14;

                if (Math.abs(currentDisplacementScale - lastScaleApplied) > 0.04) {
                    const finalScale = currentDisplacementScale < 0.08 ? 0 : currentDisplacementScale;
                    liquidDisplacement.setAttribute('scale', finalScale.toFixed(2));
                    lastScaleApplied = currentDisplacementScale;
                }

                // Ondulação contínua orgânica da água através da turbulência
                if (currentDisplacementScale > 0.08) {
                    const freqX = (0.016 + Math.sin(tick * 0.8) * 0.005).toFixed(4);
                    const freqY = (0.024 + Math.cos(tick * 0.95) * 0.005).toFixed(4);
                    liquidTurbulence.setAttribute('baseFrequency', `${freqX} ${freqY}`);
                }
            }

            requestAnimationFrame(animateLiquidSurface);
        }
        animateLiquidSurface();
    }


    /* ==========================================================================
       9. MOTOR DA RODA CIRCULAR DE CARTAS EM LEQUE DOBRADO (ARC MARUMO STYLE)
       ========================================================================== */
    const wheelRotor = document.getElementById('cardWheelRotor');
    const wheelStage = document.querySelector('.card-wheel-stage');

    if (wheelRotor && wheelStage) {
        const wheelCards = Array.from(wheelRotor.querySelectorAll('.wheel-card'));
        const totalCards = wheelCards.length;
        const infoNumber = document.getElementById('infoPanelNumber');
        const infoTitle = document.getElementById('infoPanelTitle');
        const counterCurrent = document.querySelector('.counter-current');
        const btnPrev = document.getElementById('wheelNavPrev');
        const btnNext = document.getElementById('wheelNavNext');

        // Posição contínua e motor cinemático de 2ª ordem (Spring-Damper calibrado para 550ms - 700ms)
        let targetOffset = 0;
        let currentOffset = 0;
        let velocity = 0;
        let lastActiveIndex = -1;
        let isPanelFading = false;

        // Suporte adaptativo a preferências de movimento (Acessibilidade)
        const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const urlMotion = new URLSearchParams(window.location.search).get('motion');
        let isReducedMotion = urlMotion ? urlMotion === 'reduce' : mediaQueryReducedMotion.matches;
        mediaQueryReducedMotion.addEventListener('change', (e) => {
            if (!urlMotion) isReducedMotion = e.matches;
        });

        // Parâmetros geométricos adaptativos do leque dobrado
        function getFanGeometry() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (width > 900) {
                return {
                    spacingX: 330,
                    arcFactorY: 22,
                    depthZ: 75,
                    rotZDeg: 10.5,
                    rotYDeg: 22
                };
            } else if (width > 640) {
                return {
                    spacingX: 250,
                    arcFactorY: 16,
                    depthZ: 55,
                    rotZDeg: 8.0,
                    rotYDeg: 18
                };
            } else if (width > 430) {
                return {
                    spacingX: 180,
                    arcFactorY: 12,
                    depthZ: 40,
                    rotZDeg: 6.0,
                    rotYDeg: 14
                };
            } else if (width > 360 || height > 620) {
                // Celulares médios (390-430px) — cartas laterais parcialmente visíveis
                return {
                    spacingX: 150,
                    arcFactorY: 10,
                    depthZ: 35,
                    rotZDeg: 5.5,
                    rotYDeg: 12
                };
            } else {
                // Celulares compactos (320-360px) com viewport baixa
                return {
                    spacingX: 130,
                    arcFactorY: 8,
                    depthZ: 30,
                    rotZDeg: 5.0,
                    rotYDeg: 10
                };
            }
        }

        let fanGeo = getFanGeometry();
        window.addEventListener('resize', () => {
            fanGeo = getFanGeometry();
        });

        // Atualização suave do painel informativo com transição fade
        function updatePanels(activeIdx) {
            if (activeIdx === lastActiveIndex) return;
            lastActiveIndex = activeIdx;

            const activeCard = wheelCards[activeIdx];
            if (!activeCard) return;

            const wheelInfoPanel = document.getElementById('wheelInfoPanel');
            if (wheelInfoPanel && !isPanelFading) {
                isPanelFading = true;
                wheelInfoPanel.classList.add('fading');
                setTimeout(() => {
                    if (infoNumber) infoNumber.textContent = (activeIdx + 1).toString().padStart(2, '0');
                    if (infoTitle) {
                        const titleEl = activeCard.querySelector('.card-title');
                        if (titleEl) infoTitle.textContent = titleEl.textContent;
                    }
                    if (counterCurrent) counterCurrent.textContent = (activeIdx + 1).toString().padStart(2, '0');
                    wheelInfoPanel.classList.remove('fading');
                    isPanelFading = false;
                }, 160);
            } else {
                if (infoNumber) infoNumber.textContent = (activeIdx + 1).toString().padStart(2, '0');
                if (infoTitle) {
                    const titleEl = activeCard.querySelector('.card-title');
                    if (titleEl) infoTitle.textContent = titleEl.textContent;
                }
                if (counterCurrent) counterCurrent.textContent = (activeIdx + 1).toString().padStart(2, '0');
            }
        }

        // Loop de Renderização e Cinemática Contínua em Leque 3D com Dolly Zoom
        function renderArcFan() {
            // Parâmetros de física adaptativos:
            // Modo Padrão: Spring-Damper completo (~620ms a 680ms) com aceleração inicial e micro-inércia
            // Modo Acessível (prefers-reduced-motion: reduce): Animação mais curta (~350ms-400ms) e sem oscilação
            const spring = isReducedMotion ? 0.075 : 0.026;
            const damping = isReducedMotion ? 0.65 : 0.81;

            const force = (targetOffset - currentOffset) * spring;
            velocity = (velocity + force) * damping;
            currentOffset += velocity;

            // Se estiver a menos de 0.001 da meta com velocidade residual nula, assenta exatamente na posição
            if (Math.abs(targetOffset - currentOffset) < 0.001 && Math.abs(velocity) < 0.0005) {
                currentOffset = targetOffset;
                velocity = 0;
            }

            const normalizedActive = Math.round(currentOffset);
            const activeIndex = ((normalizedActive % totalCards) + totalCards) % totalCards;
            updatePanels(activeIndex);

            // 1. Dinâmica de Câmera Cinematográfica (Dolly Zoom / Push-in e Pull-out)
            // No modo acessível (reduced-motion), a câmera não desloca para evitar cinetose vestibular
            if (!isReducedMotion) {
                const transitionFraction = Math.abs(currentOffset - normalizedActive);
                const transitionPeak = Math.sin(Math.min(1, transitionFraction * 2) * (Math.PI / 2));
                const cameraDollyZ = -transitionPeak * 45;
                const cameraTiltX = transitionPeak * 2.2;
                wheelRotor.style.transform = `translate3d(0, 0, ${cameraDollyZ.toFixed(1)}px) rotateX(${cameraTiltX.toFixed(2)}deg)`;
            } else {
                wheelRotor.style.transform = 'translate3d(0, 0, 0px) rotateX(0deg)';
            }

            // 2. Renderização de cada carta com iluminação e geometria 100% contínuas
            wheelCards.forEach((card, i) => {
                // Cálculo contínuo da distância angular relativa ao centro frontal
                let rawDiff = (i - currentOffset) % totalCards;
                if (rawDiff > totalCards / 2) rawDiff -= totalCards;
                if (rawDiff < -totalCards / 2) rawDiff += totalCards;

                const diff = rawDiff;
                const absDiff = Math.abs(diff);
                const sign = Math.sign(diff);

                // Curvatura e trajeto tridimensional visível
                const posX = sign * Math.pow(absDiff, 0.94) * fanGeo.spacingX;
                const posY = Math.pow(absDiff, 1.65) * fanGeo.arcFactorY;
                const posZ = -Math.pow(absDiff, 1.25) * fanGeo.depthZ;

                // Rotações tridimensionais (leque no plano + perspectiva convergente)
                const rotZ = diff * fanGeo.rotZDeg;
                const rotY = -diff * fanGeo.rotYDeg;

                // Escala contínua: carta central com destaque (1.06), reduzindo progressivamente no percurso
                const scale = Math.max(0.70, 1.06 - absDiff * 0.13);

                // Visibilidade ampla de todo o percurso (as cartas laterais permanecem visíveis durante toda a transição)
                const opacity = Math.max(0, Math.min(1, 1 - Math.pow(absDiff / 2.75, 2.4)));
                const zIndex = Math.round(30 - absDiff * 8);

                // Fator de proximidade ao centro (1.0 no centro exato, diminuindo suavemente até 0 nas laterais)
                const centerProximity = Math.max(0, 1 - Math.min(1, absDiff));
                const glow = Math.pow(centerProximity, 1.35);

                // Iluminação contínua (borda branca e sombra vermelha progressivas via CSS Custom Property)
                card.style.setProperty('--card-glow', glow.toFixed(3));

                // Brilho e contraste contínuos que mudam progressivamente durante o movimento
                const brightness = (0.52 + centerProximity * 0.55).toFixed(3);
                const contrast = (0.95 + centerProximity * 0.10).toFixed(3);

                // Aplicação da matriz tridimensional calculada frame a frame
                card.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, ${posZ.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
                card.style.opacity = opacity.toFixed(3);
                card.style.zIndex = zIndex;
                card.style.filter = `brightness(${brightness}) contrast(${contrast})`;
                card.style.pointerEvents = absDiff > 2.4 ? 'none' : 'auto';

                // Ativação da classe e atributos de foco
                const isCentral = absDiff < 0.45;
                card.classList.toggle('active', isCentral);
                card.setAttribute('aria-selected', isCentral ? 'true' : 'false');
                card.setAttribute('tabindex', isCentral ? '0' : '-1');
            });

            requestAnimationFrame(renderArcFan);
        }

        // Funções de comando de rotação (uma posição por rolagem)
        function stepWheel(direction) {
            targetOffset = Math.round(targetOffset) + direction;
        }

        function jumpToCard(index) {
            let diff = index - (targetOffset % totalCards);
            if (diff > totalCards / 2) diff -= totalCards;
            if (diff < -totalCards / 2) diff += totalCards;
            targetOffset = targetOffset + diff;
        }

        // 1. Scroll com inércia natural e absorção proporcional (sem trava rígida estática)
        let scrollAccumulator = 0;
        let lastWheelTime = 0;
        const SCROLL_THRESHOLD = 55;

        wheelStage.addEventListener('wheel', (e) => {
            e.preventDefault();
            const now = performance.now();
            const dt = now - lastWheelTime;
            lastWheelTime = now;

            if (dt > 260) {
                scrollAccumulator = 0;
            }

            const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            scrollAccumulator += delta;

            if (Math.abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
                const direction = Math.sign(scrollAccumulator);
                stepWheel(direction);
                scrollAccumulator = scrollAccumulator * 0.15;
            }
        }, { passive: false });

        // 2. Navegação por Teclado (Setas e Enter)
        window.addEventListener('keydown', (e) => {
            if (!wheelRotor) return;
            if (e.target.matches('input, textarea, select')) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                stepWheel(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                stepWheel(-1);
            } else if (e.key === 'Enter') {
                const activeCard = wheelCards[lastActiveIndex];
                const activeLink = activeCard ? activeCard.querySelector('.card-link') : null;
                if (activeLink && document.activeElement !== activeLink) {
                    activeLink.click();
                }
            }
        });

        // 3. Clique nas cartas (se for lateral, gira o leque; se for a central, abre o link)
        wheelCards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                let rawDiff = (idx - currentOffset) % totalCards;
                if (rawDiff > totalCards / 2) rawDiff -= totalCards;
                if (rawDiff < -totalCards / 2) rawDiff += totalCards;

                if (Math.abs(rawDiff) > 0.45) {
                    e.preventDefault();
                    targetOffset = Math.round(targetOffset) + Math.round(rawDiff);
                }
            });
        });

        // 4. Botões de navegação lateral (Prev / Next)
        if (btnPrev) {
            btnPrev.addEventListener('click', () => stepWheel(-1));
        }
        if (btnNext) {
            btnNext.addEventListener('click', () => stepWheel(1));
        }

        // 5. Suporte a Toque e Swipe (Touch Devices)
        let touchStartX = 0;
        let touchStartY = 0;
        wheelStage.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        wheelStage.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX < 0) {
                        stepWheel(1);
                    } else {
                        stepWheel(-1);
                    }
                }
            }
        }, { passive: true });

        // Início imediato do loop de leque dobrado
        renderArcFan();
    }

});
