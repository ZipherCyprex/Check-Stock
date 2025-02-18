// Config
const PRODUCTS_JSON = 'config/products.json';

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-links').forEach(menu => {
                menu.classList.toggle('active');
            });
        });
    });

    // Load Products
    fetch(PRODUCTS_JSON)
        .then(res => res.json())
        .then(data => {
            const path = window.location.pathname.split('/').pop();

            if (path === 'index.html' || path === '') renderHome(data);
            if (path === 'products.html') renderProducts(data);
            if (path === 'product-detail.html') renderProductDetail(data);
        });
});

// Render Functions
function renderHome(data) {
    const container = document.querySelector('.featured-items .products-container');
    renderProductCards(container, data.featuredItems);
}

function renderProducts(data) {
    const container = document.querySelector('.product-listing .products-container');
    renderProductCards(container, data.featuredItems);
}

function renderProductDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const product = data.featuredItems.find(item => item.id === params.get('id'));

    if (!product) return;

    // Update Page Content
    document.title = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `฿${product.price.toFixed(2)}`;
    document.getElementById('product-stock').textContent = product.stock;
    document.getElementById('main-product-image').src = product.image;

    // Description
    const descriptionContainer = document.querySelector('.product-description');
    if (product.description) {
        descriptionContainer.innerHTML = `
      <h3>Description</h3>
      <p>${product.description}</p>
    `;
    }

    // Features
    const featuresList = document.getElementById('features-list');
    if (product.features) {
        featuresList.innerHTML = product.features
            .map(feature => `<li>${feature}</li>`)
            .join('');
    }
}

// Helper Function
function renderProductCards(container, products) {
    container.innerHTML = products.map(product => `
    <a href="product-detail.html?id=${product.id}" class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <span class="price">฿${product.price.toFixed(2)}</span>
      <span class="stock ${product.stock === 'Out of stock' ? 'out' : ''}">
        ${product.stock}
      </span>
    </a>
  `).join('');
}

// เพิ่มส่วนนี้ในฟังก์ชัน fetch
if (path === 'gallery.html') {
    renderGallery(data.gallery);
}

// ฟังก์ชันแสดง Gallery ใหม่
function renderGallery(galleryData) {
    const container = document.querySelector('.gallery-grid');

    galleryData.categories.forEach(category => {
        // เพิ่มหัวข้อหมวดหมู่
        container.innerHTML += `
      <h3 class="gallery-category-title">${category.name}</h3>
    `;

        // เพิ่มรูปภาพ
        const imagesHTML = category.images.map(img => `
      <div class="gallery-item">
        <img src="${img}" alt="${category.name}">
      </div>
    `).join('');

        container.innerHTML += `
      <div class="gallery-category">
        ${imagesHTML}
      </div>
    `;
    });
}