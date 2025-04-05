document.addEventListener('DOMContentLoaded', function() {
    // Code de navigation mobile existant
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // S'assurer que les éléments existent
    if (!mobileMenuButton || !navLinks) {
        console.error('Éléments du menu mobile introuvables');
        return; // Sortir de la fonction si les éléments n'existent pas
    }
    
    // Toggle le menu mobile
    mobileMenuButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Empêcher la propagation
        navLinks.classList.toggle('active');
        console.log('Menu toggled:', navLinks.classList.contains('active')); // Pour le débogage
    });
    
    // Gestion des dropdowns sur mobile - Cibler SEULEMENT le lien principal
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a:first-child'); // Seulement le lien principal, pas les sous-liens
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                // Vérifier si nous sommes en mode mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Empêcher la navigation
                    e.stopPropagation(); // Empêcher la propagation
                    
                    // Vérifier si ce dropdown est déjà actif
                    const isActive = dropdown.classList.contains('active');
                    
                    // Fermer tous les dropdowns d'abord
                    dropdowns.forEach(d => d.classList.remove('active'));
                    
                    // Rouvrir celui-ci s'il n'était pas déjà actif
                    if (!isActive) {
                        dropdown.classList.add('active');
                    }
                    
                    console.log('Dropdown toggled:', dropdown.classList.contains('active')); // Pour le débogage
                }
            });
        }
    });
    
    // Permettre la navigation pour les liens dans les dropdowns
    dropdowns.forEach(dropdown => {
        const dropdownMenuLinks = dropdown.querySelectorAll('.dropdown-menu a');
        
        dropdownMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Ne pas empêcher la navigation pour ces liens
                e.stopPropagation(); // Mais empêcher que le clic ferme le menu
                // Optionnel: fermer le menu après avoir cliqué
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
    
    // Ajout: Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Réinitialiser les classes active en mode desktop
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // GESTION CONDITIONNELLE DE LA PAGINATION POUR LES ACTUALITÉS
    // =========================================================
    
    // Vérifier si la section d'actualités existe sur la page
    const recentActu = document.querySelector('.recent-actu');
    if (recentActu) {
        // Détecter si nous sommes sur la page d'accueil ou la page Evenement
        const isHomePage = window.location.pathname === "/" || 
        window.location.pathname.includes("Home") || 
        window.location.pathname.endsWith("index.html");
        
        // Configuration de la pagination
        const itemsPerPage = 6; // Nombre d'actualités par page
        const contentActu = document.querySelectorAll('.content-actu');
        const totalItems = contentActu.length;
        
        if (isHomePage) {
            // Sur la page d'accueil : afficher seulement les 3 premiers éléments et un bouton "Voir plus"
            contentActu.forEach((item, index) => {
                if (index < itemsPerPage) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Créer le bouton "Voir plus"
            const viewMoreContainer = document.createElement('div');
            viewMoreContainer.className = 'view-more-container';
            
            const viewMoreBtn = document.createElement('a');
            viewMoreBtn.href = 'Evenement.html';
            viewMoreBtn.className = 'view-more-btn';
            viewMoreBtn.textContent = 'Voir toutes les actualités';
            viewMoreBtn.setAttribute('aria-label', 'Voir toutes les actualités sur la page Événements');
            
            viewMoreContainer.appendChild(viewMoreBtn);
            recentActu.insertAdjacentElement('afterend', viewMoreContainer);
            
        } else {
            // Sur la page Evenement : mettre en place la pagination complète
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            // Créer l'élément de pagination
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            
            // Ajouter la pagination après la section des actualités
            recentActu.insertAdjacentElement('afterend', paginationContainer);
            
            // Fonction pour afficher la pagination
            function renderPagination() {
                paginationContainer.innerHTML = '';
                
                // Créer le bouton "Précédent"
                const prevBtn = document.createElement('button');
                prevBtn.innerHTML = '&laquo; Précédent';
                prevBtn.className = 'pagination-btn prev';
                prevBtn.setAttribute('aria-label', 'Page précédente');
                if (currentPage === 1) {
                    prevBtn.disabled = true;
                    prevBtn.classList.add('disabled');
                }
                prevBtn.addEventListener('click', () => {
                    if (currentPage > 1) {
                        goToPage(currentPage - 1);
                    }
                });
                paginationContainer.appendChild(prevBtn);
                
                // Créer les boutons de pages
                for (let i = 1; i <= totalPages; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.innerText = i;
                    pageBtn.className = 'pagination-btn page-number';
                    pageBtn.setAttribute('aria-label', `Page ${i}`);
                    if (i === currentPage) {
                        pageBtn.classList.add('active');
                        pageBtn.setAttribute('aria-current', 'page');
                    }
                    pageBtn.addEventListener('click', () => goToPage(i));
                    paginationContainer.appendChild(pageBtn);
                }
                
                // Créer le bouton "Suivant"
                const nextBtn = document.createElement('button');
                nextBtn.innerHTML = 'Suivant &raquo;';
                nextBtn.className = 'pagination-btn next';
                nextBtn.setAttribute('aria-label', 'Page suivante');
                if (currentPage === totalPages) {
                    nextBtn.disabled = true;
                    nextBtn.classList.add('disabled');
                }
                nextBtn.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        goToPage(currentPage + 1);
                    }
                });
                paginationContainer.appendChild(nextBtn);
            }
            
            // Fonction pour afficher les actualités de la page courante
            function showItems(page) {
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                
                // Mettre à jour les attributs aria pour l'accessibilité
                contentActu.forEach((item, index) => {
                    if (index >= startIndex && index < endIndex) {
                        item.style.display = 'flex';
                        item.setAttribute('aria-hidden', 'false');
                    } else {
                        item.style.display = 'none';
                        item.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Mettre à jour le texte d'info de pagination
                const paginationInfo = document.createElement('div');
                paginationInfo.className = 'pagination-info';
                paginationInfo.textContent = `Page ${page} sur ${totalPages}`;
                paginationInfo.setAttribute('aria-live', 'polite');
                
                // Remplacer l'info existante ou l'ajouter
                const existingInfo = document.querySelector('.pagination-info');
                if (existingInfo) {
                    existingInfo.replaceWith(paginationInfo);
                } else {
                    paginationContainer.insertAdjacentElement('beforebegin', paginationInfo);
                }
            }
            
            // Fonction pour aller à une page spécifique
            function goToPage(page) {
                currentPage = page;
                showItems(currentPage);
                renderPagination();
                
                // Scroll vers le haut de la section d'actualités avec une légère marge
                // window.scrollTo({
                //     top: recentActu.offsetTop - 50,
                //     behavior: 'smooth'
                // });
            }
            
            // Initialiser à la première page
            let currentPage = 1;
            showItems(currentPage);
            renderPagination();
        }
    }
});