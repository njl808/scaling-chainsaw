// Dynamic Product Slideshow Application
class SlideshowApp {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.isPlaying = true;
        this.slideInterval = null;
        this.products = [];
        this.mediaFiles = [];
        this.productToDelete = null;
        this.settings = {
            defaultSlideDuration: 6,
            transitionSpeed: 800,
            autoAdvance: true,
            theme: 'professional',
            brandColors: {
                primary: '#00BFFF',
                secondary: '#0095CC',
                accent: '#FFFFFF',
                background: '#000000'
            }
        };
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.initializeElements();
        this.bindEvents();
        this.loadSampleData();
        this.generateSlides();
        this.startSlideshow();
        this.updateDashboard();
    }

    initializeElements() {
        // Main view elements
        this.slideshowView = document.getElementById('slideshow-view');
        this.adminView = document.getElementById('admin-view');
        this.slideContainer = document.getElementById('slide-container');
        this.slideDots = document.getElementById('slide-dots');
        this.progressBar = document.querySelector('.progress-fill');
        
        // Admin elements
        this.navItems = document.querySelectorAll('.nav-item');
        this.adminSections = document.querySelectorAll('.admin-section');
        this.productsGrid = document.getElementById('products-grid');
        this.productModal = document.getElementById('product-modal');
        this.deleteModal = document.getElementById('delete-modal');
        this.productForm = document.getElementById('product-form');
        
        // Control elements
        this.adminToggle = document.getElementById('admin-toggle');
        this.backToSlideshow = document.getElementById('back-to-slideshow');
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev-slide');
        this.nextBtn = document.getElementById('next-slide');
        this.fullscreenBtn = document.getElementById('fullscreen');
    }

    bindEvents() {
        // View switching
        this.adminToggle.addEventListener('click', () => this.toggleView());
        this.backToSlideshow.addEventListener('click', () => this.showSlideshow());
        
        // Slideshow controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Admin navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showAdminSection(section);
            });
        });
        
        // Product management
        const addProductBtn = document.getElementById('add-product');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProductModal();
            });
        }
        
        // Product form buttons
        const saveProductBtn = document.getElementById('save-product');
        const cancelProductBtn = document.getElementById('cancel-product');
        
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveProduct(e);
            });
        }
        
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
            });
        }
        
        // Delete confirmation modal
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmDeleteProduct();
            });
        }
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
            });
        }
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModals();
            });
        });
        
        // Settings
        const saveSettingsBtn = document.getElementById('save-settings');
        const saveAppSettingsBtn = document.getElementById('save-app-settings');
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
        if (saveAppSettingsBtn) {
            saveAppSettingsBtn.addEventListener('click', () => this.saveAppSettings());
        }
        
        // File upload
        this.setupFileUpload();
        
        // Data import/export
        const exportBtn = document.getElementById('export-data');
        const importBtn = document.getElementById('import-data');
        
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (importBtn) importBtn.addEventListener('click', () => this.importData());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Click outside modal to close
        this.productModal.addEventListener('click', (e) => {
            if (e.target === this.productModal) this.hideModals();
        });
        
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.hideModals();
        });
        
        // Preview slideshow
        const previewBtn = document.getElementById('preview-slideshow');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showSlideshow();
                this.generateSlides();
                this.startSlideshow();
            });
        }
    }

    // Data Management
    async loadData() {
        try {
            const savedProducts = localStorage.getItem('slideshow_products');
            const savedSettings = localStorage.getItem('slideshow_settings');
            const savedMedia = localStorage.getItem('slideshow_media');
            
            if (savedProducts) this.products = JSON.parse(savedProducts);
            if (savedSettings) this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            if (savedMedia) this.mediaFiles = JSON.parse(savedMedia);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error loading saved data', 'error');
        }
    }

    saveData() {
        try {
            localStorage.setItem('slideshow_products', JSON.stringify(this.products));
            localStorage.setItem('slideshow_settings', JSON.stringify(this.settings));
            localStorage.setItem('slideshow_media', JSON.stringify(this.mediaFiles));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    loadSampleData() {
        if (this.products.length === 0) {
            this.products = [
                {
                    id: "craven-pc2500b",
                    name: "Craven PC2500B Display Refrigerator",
                    description: "Professional display refrigerator with LED lighting and energy-efficient cooling",
                    category: "Commercial Refrigeration",
                    brand: "Craven Cooling",
                    images: [
                        {
                            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
                            caption: "Front view with LED lighting",
                            alt: "Craven PC2500B refrigerator front view"
                        }
                    ],
                    specifications: {
                        "Dimensions": "200cm H x 120cm W x 65cm D",
                        "Energy Consumption": "3,723 kWh/year",
                        "Temperature Range": "2°C to 8°C",
                        "Capacity": "850 Litres",
                        "Doors": "3 Glass doors",
                        "Lighting": "LED strip lighting"
                    },
                    features: [
                        "Crisp LED Lighting",
                        "Cool Energy Savings", 
                        "Customizable Display",
                        "Low Energy Performance"
                    ],
                    pricing: {
                        msrp: 4299,
                        currency: "GBP"
                    },
                    slideSettings: {
                        template: "product-showcase",
                        duration: 7,
                        animations: "premium"
                    }
                },
                {
                    id: "sample-laptop",
                    name: "TechPro Ultra 15 Laptop",
                    description: "High-performance laptop for professionals and creators",
                    category: "Electronics",
                    brand: "TechPro",
                    images: [
                        {
                            url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
                            caption: "Sleek aluminum design",
                            alt: "TechPro Ultra 15 laptop closed view"
                        }
                    ],
                    specifications: {
                        "Processor": "Intel Core i7-12700H",
                        "Memory": "32GB DDR5",
                        "Storage": "1TB NVMe SSD",
                        "Display": "15.6\" 4K OLED",
                        "Graphics": "NVIDIA RTX 4060",
                        "Battery Life": "12 hours"
                    },
                    features: [
                        "4K OLED Display",
                        "All-day Battery Life",
                        "Professional Graphics",
                        "Ultra-fast Processing"
                    ],
                    pricing: {
                        msrp: 2199,
                        currency: "GBP"
                    },
                    slideSettings: {
                        template: "tech-product",
                        duration: 6,
                        animations: "modern"
                    }
                }
            ];
            this.saveData();
        }
    }

    // Slideshow Management
    generateSlides() {
        this.slides = [];
        this.slideContainer.innerHTML = '';
        this.slideDots.innerHTML = '';
        
        if (this.products.length === 0) {
            this.createWelcomeSlide();
            return;
        }

        // Create brand intro slide
        this.createBrandIntroSlide();
        
        // Create product slides
        this.products.forEach(product => {
            this.createProductSlides(product);
        });
        
        // Create dots for navigation
        this.createSlideDots();
    }

    createBrandIntroSlide() {
        const slide = document.createElement('div');
        slide.className = 'slide slide-brand-intro';
        slide.innerHTML = `
            <div>
                <h1>Welcome to Our Product Showcase</h1>
                <p style="font-size: var(--font-size-xl); margin-top: var(--space-20); color: rgba(255,255,255,0.8);">
                    Discover innovative products designed for excellence
                </p>
            </div>
        `;
        
        this.slideContainer.appendChild(slide);
        this.slides.push({
            element: slide,
            duration: 4,
            type: 'brand-intro'
        });
    }

    createProductSlides(product) {
        // Product reveal slide
        const revealSlide = document.createElement('div');
        revealSlide.className = 'slide slide-product-reveal';
        
        const imageUrl = product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800';
        const price = product.pricing ? `£${product.pricing.msrp.toLocaleString()}` : 'Contact for pricing';
        
        revealSlide.innerHTML = `
            <div>
                <img src="${imageUrl}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="product-price">${price}</div>
            </div>
        `;
        
        this.slideContainer.appendChild(revealSlide);
        this.slides.push({
            element: revealSlide,
            duration: product.slideSettings?.duration || this.settings.defaultSlideDuration,
            type: 'product-reveal',
            product: product
        });

        // Features slide
        if (product.features && product.features.length > 0) {
            this.createFeaturesSlide(product);
        }

        // Specifications slide
        if (product.specifications && Object.keys(product.specifications).length > 0) {
            this.createSpecificationsSlide(product);
        }
    }

    createFeaturesSlide(product) {
        const featuresSlide = document.createElement('div');
        featuresSlide.className = 'slide slide-features';
        
        const featuresHTML = product.features.map(feature => `
            <div class="feature-item">
                <h4>${feature}</h4>
                <p>Advanced technology for superior performance</p>
            </div>
        `).join('');
        
        featuresSlide.innerHTML = `
            <div>
                <h2>${product.name} - Key Features</h2>
                <div class="features-grid">
                    ${featuresHTML}
                </div>
            </div>
        `;
        
        this.slideContainer.appendChild(featuresSlide);
        this.slides.push({
            element: featuresSlide,
            duration: 6,
            type: 'features',
            product: product
        });
    }

    createSpecificationsSlide(product) {
        const specsSlide = document.createElement('div');
        specsSlide.className = 'slide slide-specifications';
        
        const specsHTML = Object.entries(product.specifications).map(([key, value]) => `
            <li>
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </li>
        `).join('');
        
        const imageUrl = product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800';
        
        specsSlide.innerHTML = `
            <div>
                <img src="${imageUrl}" alt="${product.name}" class="product-image">
            </div>
            <div>
                <h2>Technical Specifications</h2>
                <ul class="specs-list">
                    ${specsHTML}
                </ul>
            </div>
        `;
        
        this.slideContainer.appendChild(specsSlide);
        this.slides.push({
            element: specsSlide,
            duration: 8,
            type: 'specifications',
            product: product
        });
    }

    createWelcomeSlide() {
        const slide = document.createElement('div');
        slide.className = 'slide slide-brand-intro';
        slide.innerHTML = `
            <div>
                <h1>Dynamic Product Slideshow</h1>
                <p style="font-size: var(--font-size-xl); margin-top: var(--space-20); color: rgba(255,255,255,0.8);">
                    Add products through the Admin Panel to get started
                </p>
                <button onclick="app.showAdminPanel()" class="btn btn--primary" style="margin-top: var(--space-24);">
                    Open Admin Panel
                </button>
            </div>
        `;
        
        this.slideContainer.appendChild(slide);
        this.slides.push({
            element: slide,
            duration: 10,
            type: 'welcome'
        });
        
        this.createSlideDots();
    }

    createSlideDots() {
        this.slideDots.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.slideDots.appendChild(dot);
        });
    }

    startSlideshow() {
        if (this.slides.length === 0) return;
        
        this.currentSlide = 0;
        this.showSlide(0);
        
        if (this.settings.autoAdvance && this.isPlaying) {
            this.scheduleNextSlide();
        }
    }

    showSlide(index) {
        if (this.slides.length === 0) return;
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.element.classList.remove('active', 'prev');
        });
        
        // Remove active class from all dots
        const dots = this.slideDots.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        this.slides[index].element.classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        // Update progress bar
        this.updateProgressBar(index);
    }

    nextSlide() {
        if (this.slides.length === 0) return;
        
        // Clear any existing interval
        if (this.slideInterval) clearTimeout(this.slideInterval);
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
        
        if (this.settings.autoAdvance && this.isPlaying) {
            this.scheduleNextSlide();
        }
    }

    previousSlide() {
        if (this.slides.length === 0) return;
        
        // Clear any existing interval
        if (this.slideInterval) clearTimeout(this.slideInterval);
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.showSlide(this.currentSlide);
        
        if (this.settings.autoAdvance && this.isPlaying) {
            this.scheduleNextSlide();
        }
    }

    goToSlide(index) {
        if (this.slides.length === 0) return;
        
        // Clear any existing interval
        if (this.slideInterval) clearTimeout(this.slideInterval);
        
        this.currentSlide = index;
        this.showSlide(index);
        
        if (this.settings.autoAdvance && this.isPlaying) {
            this.scheduleNextSlide();
        }
    }

    scheduleNextSlide() {
        if (this.slideInterval) clearTimeout(this.slideInterval);
        
        if (this.slides.length > 0) {
            const currentSlideData = this.slides[this.currentSlide];
            const duration = (currentSlideData.duration || this.settings.defaultSlideDuration) * 1000;
            
            // Animate progress bar
            this.progressBar.style.transition = `width ${duration}ms linear`;
            this.progressBar.style.width = '100%';
            
            this.slideInterval = setTimeout(() => {
                if (this.isPlaying && this.settings.autoAdvance) {
                    this.nextSlide();
                }
            }, duration);
        }
    }

    updateProgressBar(slideIndex) {
        this.progressBar.style.transition = 'width 0.3s ease';
        this.progressBar.style.width = '0%';
        
        setTimeout(() => {
            if (this.isPlaying && this.settings.autoAdvance) {
                const currentSlideData = this.slides[slideIndex];
                const duration = (currentSlideData?.duration || this.settings.defaultSlideDuration) * 1000;
                this.progressBar.style.transition = `width ${duration}ms linear`;
                this.progressBar.style.width = '100%';
            }
        }, 100);
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
        
        if (this.isPlaying && this.settings.autoAdvance) {
            this.scheduleNextSlide();
        } else {
            if (this.slideInterval) clearTimeout(this.slideInterval);
            this.progressBar.style.transition = 'width 0.3s ease';
            this.progressBar.style.width = '0%';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // View Management
    toggleView() {
        if (this.slideshowView.classList.contains('active')) {
            this.showAdminPanel();
        } else {
            this.showSlideshow();
        }
    }

    showSlideshow() {
        this.slideshowView.classList.add('active');
        this.adminView.classList.remove('active');
        this.adminToggle.textContent = 'Admin Panel';
    }

    showAdminPanel() {
        this.adminView.classList.add('active');
        this.slideshowView.classList.remove('active');
        this.adminToggle.textContent = 'Back to Slideshow';
        this.updateDashboard();
        this.renderProducts();
    }

    showAdminSection(sectionName) {
        console.log('Switching to section:', sectionName);
        
        // Update navigation
        this.navItems.forEach(item => {
            const itemSection = item.getAttribute('data-section');
            item.classList.toggle('active', itemSection === sectionName);
        });
        
        // Update sections
        this.adminSections.forEach(section => {
            const sectionId = `${sectionName}-section`;
            section.classList.toggle('active', section.id === sectionId);
        });
        
        // Load section-specific data
        switch(sectionName) {
            case 'products':
                this.renderProducts();
                break;
            case 'media':
                this.renderMediaLibrary();
                break;
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'slideshow':
                this.loadSlideshowSettings();
                break;
            case 'settings':
                this.loadAppSettings();
                break;
        }
    }

    // Load settings into form fields
    loadSlideshowSettings() {
        const durationInput = document.getElementById('slide-duration');
        const transitionInput = document.getElementById('transition-speed');
        const autoAdvanceSelect = document.getElementById('auto-advance');
        const themeSelect = document.getElementById('theme');
        
        if (durationInput) durationInput.value = this.settings.defaultSlideDuration;
        if (transitionInput) transitionInput.value = this.settings.transitionSpeed;
        if (autoAdvanceSelect) autoAdvanceSelect.value = this.settings.autoAdvance.toString();
        if (themeSelect) themeSelect.value = this.settings.theme;
    }

    loadAppSettings() {
        const primaryColorInput = document.getElementById('primary-color');
        const secondaryColorInput = document.getElementById('secondary-color');
        const brandNameInput = document.getElementById('brand-name');
        
        if (primaryColorInput) primaryColorInput.value = this.settings.brandColors.primary;
        if (secondaryColorInput) secondaryColorInput.value = this.settings.brandColors.secondary;
        if (brandNameInput) brandNameInput.value = this.settings.brandName || 'Your Brand';
    }

    // Product Management
    renderProducts() {
        this.productsGrid.innerHTML = '';
        
        if (this.products.length === 0) {
            this.productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: var(--space-32); color: var(--color-text-secondary);">
                    <p>No products added yet. Click "Add New Product" to get started.</p>
                </div>
            `;
            return;
        }
        
        this.products.forEach(product => {
            const card = this.createProductCard(product);
            this.productsGrid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imageUrl = product.images && product.images[0] ? product.images[0].url : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800';
        const price = product.pricing ? `£${product.pricing.msrp.toLocaleString()}` : 'Price not set';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="product-card-image" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'">
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-description">${product.description}</p>
                <div class="product-card-footer">
                    <span class="product-price-tag">${price}</span>
                    <div class="product-actions">
                        <button class="action-btn edit-btn" data-product-id="${product.id}" title="Edit">✏️</button>
                        <button class="action-btn delete-btn" data-product-id="${product.id}" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the buttons
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.editProduct(product.id);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showDeleteConfirmation(product.id);
        });
        
        return card;
    }

    showProductModal(productId = null) {
        const isEdit = productId !== null;
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = isEdit ? 'Edit Product' : 'Add Product';
        
        if (isEdit) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                this.populateProductForm(product);
            }
        } else {
            this.productForm.reset();
        }
        
        this.productForm.dataset.productId = productId || '';
        this.productModal.classList.remove('hidden');
    }

    populateProductForm(product) {
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-category').value = product.category || 'Electronics';
        document.getElementById('product-brand').value = product.brand || '';
        document.getElementById('product-price').value = product.pricing?.msrp || '';
        document.getElementById('product-features').value = product.features ? product.features.join('\n') : '';
        document.getElementById('product-specs').value = product.specifications ? JSON.stringify(product.specifications, null, 2) : '{}';
        document.getElementById('product-image').value = product.images && product.images[0] ? product.images[0].url : '';
        document.getElementById('product-duration').value = product.slideSettings?.duration || 6;
    }

    saveProduct(e) {
        e.preventDefault();
        
        const productId = this.productForm.dataset.productId;
        const isEdit = productId !== '';
        
        // Validate required fields
        const productName = document.getElementById('product-name').value.trim();
        if (!productName) {
            this.showToast('Product name is required', 'error');
            return;
        }
        
        try {
            // Parse features
            const featuresText = document.getElementById('product-features').value;
            const features = featuresText.split('\n').filter(f => f.trim() !== '');
            
            // Parse specifications
            const specsText = document.getElementById('product-specs').value;
            let specifications = {};
            try {
                specifications = JSON.parse(specsText);
            } catch {
                specifications = {};
            }
            
            const product = {
                id: isEdit ? productId : this.generateId(),
                name: productName,
                description: document.getElementById('product-description').value,
                category: document.getElementById('product-category').value,
                brand: document.getElementById('product-brand').value,
                features: features,
                specifications: specifications,
                images: [{
                    url: document.getElementById('product-image').value || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
                    caption: 'Product image',
                    alt: productName
                }],
                pricing: {
                    msrp: parseFloat(document.getElementById('product-price').value) || 0,
                    currency: 'GBP'
                },
                slideSettings: {
                    duration: parseInt(document.getElementById('product-duration').value) || 6,
                    template: 'product-showcase',
                    animations: 'modern'
                }
            };
            
            if (isEdit) {
                const index = this.products.findIndex(p => p.id === productId);
                this.products[index] = product;
                this.showToast('Product updated successfully', 'success');
            } else {
                this.products.push(product);
                this.showToast('Product added successfully', 'success');
            }
            
            this.saveData();
            this.hideModals();
            this.renderProducts();
            this.updateDashboard();
            this.generateSlides();
            
        } catch (error) {
            console.error('Error saving product:', error);
            this.showToast('Error saving product', 'error');
        }
    }

    editProduct(productId) {
        this.showProductModal(productId);
    }

    showDeleteConfirmation(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.productToDelete = productId;
        document.getElementById('delete-product-name').textContent = product.name;
        this.deleteModal.classList.remove('hidden');
    }

    confirmDeleteProduct() {
        if (!this.productToDelete) return;
        
        this.products = this.products.filter(p => p.id !== this.productToDelete);
        this.saveData();
        this.renderProducts();
        this.updateDashboard();
        this.generateSlides();
        this.hideModals();
        this.showToast('Product deleted successfully', 'success');
        
        this.productToDelete = null;
    }

    // Utility Functions
    generateId() {
        return 'product_' + Math.random().toString(36).substr(2, 9);
    }

    hideModals() {
        this.productModal.classList.add('hidden');
        this.deleteModal.classList.add('hidden');
    }

    updateDashboard() {
        document.getElementById('total-products').textContent = this.products.length;
        document.getElementById('total-slides').textContent = this.slides.length;
        document.getElementById('total-images').textContent = this.mediaFiles.length;
        
        this.updateMiniSlideshow();
    }

    updateMiniSlideshow() {
        const miniSlideshow = document.getElementById('mini-slideshow');
        if (this.products.length > 0) {
            const firstProduct = this.products[0];
            const imageUrl = firstProduct.images && firstProduct.images[0] ? firstProduct.images[0].url : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800';
            
            miniSlideshow.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
                    <div>
                        <img src="${imageUrl}" alt="${firstProduct.name}" style="max-width: 120px; max-height: 80px; object-fit: cover; border-radius: var(--radius-base); margin-bottom: var(--space-8);" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'">
                        <p style="color: white; font-size: var(--font-size-sm);">${firstProduct.name}</p>
                    </div>
                </div>
            `;
        } else {
            miniSlideshow.innerHTML = `
                <div style="color: rgba(255,255,255,0.7); text-align: center;">
                    <p>No products to preview</p>
                </div>
            `;
        }
    }

    // File Upload
    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-media');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const mediaFile = {
                        id: this.generateId(),
                        name: file.name,
                        url: e.target.result,
                        type: file.type,
                        size: file.size,
                        uploadDate: new Date().toISOString()
                    };
                    
                    this.mediaFiles.push(mediaFile);
                    this.saveData();
                    this.renderMediaLibrary();
                    this.updateDashboard();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    renderMediaLibrary() {
        const mediaGrid = document.getElementById('media-grid');
        if (!mediaGrid) return;
        
        mediaGrid.innerHTML = '';
        
        if (this.mediaFiles.length === 0) {
            mediaGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: var(--space-32); color: var(--color-text-secondary);">
                    <p>No media files uploaded yet.</p>
                </div>
            `;
            return;
        }
        
        this.mediaFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'media-item';
            item.innerHTML = `<img src="${file.url}" alt="${file.name}">`;
            item.addEventListener('click', () => {
                navigator.clipboard.writeText(file.url);
                this.showToast('Image URL copied to clipboard', 'success');
            });
            mediaGrid.appendChild(item);
        });
    }

    // Settings Management
    saveSettings() {
        this.settings.defaultSlideDuration = parseInt(document.getElementById('slide-duration').value);
        this.settings.transitionSpeed = parseInt(document.getElementById('transition-speed').value);
        this.settings.autoAdvance = document.getElementById('auto-advance').value === 'true';
        this.settings.theme = document.getElementById('theme').value;
        
        this.saveData();
        this.showToast('Settings saved successfully', 'success');
    }

    saveAppSettings() {
        this.settings.brandColors.primary = document.getElementById('primary-color').value;
        this.settings.brandColors.secondary = document.getElementById('secondary-color').value;
        this.settings.brandName = document.getElementById('brand-name').value;
        
        this.saveData();
        this.showToast('App settings saved successfully', 'success');
    }

    // Data Import/Export
    exportData() {
        const data = {
            products: this.products,
            settings: this.settings,
            mediaFiles: this.mediaFiles,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slideshow-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully', 'success');
    }

    importData() {
        const fileInput = document.getElementById('import-file');
        fileInput.click();
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (data.products) this.products = data.products;
                        if (data.settings) this.settings = { ...this.settings, ...data.settings };
                        if (data.mediaFiles) this.mediaFiles = data.mediaFiles;
                        
                        this.saveData();
                        this.renderProducts();
                        this.updateDashboard();
                        this.generateSlides();
                        
                        this.showToast('Data imported successfully', 'success');
                    } catch (error) {
                        this.showToast('Error importing data', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
    }

    // Keyboard Navigation
    handleKeyboard(e) {
        if (this.slideshowView.classList.contains('active')) {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        }
        
        // Modal close with Escape
        if (e.key === 'Escape') {
            this.hideModals();
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    // Loading Overlay
    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SlideshowApp();
});