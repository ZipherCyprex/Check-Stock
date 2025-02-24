window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading");

  // ดีเลย์เพิ่มอีก 0.4 วินาที ก่อนเริ่ม fade-out
  setTimeout(() => {
    loadingScreen.classList.add("fade-out");

    // ซ่อนหลังจาก fade-out (0.8s) + ดีเลย์ (0.4s)
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 800);

  }, 400); // ดีเลย์ 0.4 วินาที
});


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
            if (path === 'gallery.html') renderGallery(data.gallery); // เพิ่มบรรทัดนี้
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

document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.thumbnail-item img');

  // เปลี่ยนรูปหลักเมื่อคลิก Thumbnail
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
      // อัปเดต src ของรูปหลัก
      mainImage.src = thumbnail.src;

      // กำหนด active class ให้ Thumbnail ที่ถูกคลิก
      document.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('active'));
      thumbnail.parentElement.classList.add('active');
    });
  });

  // ฟีเจอร์ Zoom เมื่อ Hover รูปหลัก
  mainImage.addEventListener('mousemove', (e) => {
    const rect = mainImage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // อัปเดตตำแหน่งการซูม
    mainImage.style.transformOrigin = `${x}% ${y}%`;
    mainImage.style.transform = 'scale(2)';
  });

  // รีเซ็ตเมื่อเมาส์ออกจากรูปภาพ
  mainImage.addEventListener('mouseleave', () => {
    mainImage.style.transform = 'scale(1)';
    mainImage.style.transformOrigin = 'center center';
  });
});


mainImage.addEventListener('click', () => {
  const fullScreenWindow = window.open('', '_blank');
  fullScreenWindow.document.write(`<img src="${mainImage.src}" style="width:100%;height:auto;">`);
});


function renderProductDetail(data) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = data.featuredItems.find(item => item.id === productId);

  if (!product) return;

  // อัปเดต Main Image
  const mainImage = document.getElementById('main-product-image');
  mainImage.src = product.images[0];

  // อัปเดต Thumbnails
  const thumbnailGrid = document.querySelector('.thumbnail-grid');
  thumbnailGrid.innerHTML = '';

  product.images.forEach((image, index) => {
    const thumbnailItem = document.createElement('div');
    thumbnailItem.classList.add('thumbnail-item');
    if (index === 0) thumbnailItem.classList.add('active');

    thumbnailItem.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;
    thumbnailItem.addEventListener('click', () => {
      mainImage.src = image;
      document.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('active'));
      thumbnailItem.classList.add('active');
    });

    thumbnailGrid.appendChild(thumbnailItem);
  });

  
    
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
  // ส่วนของการแสดงผล features
  const featuresList = document.getElementById('features-list');
  const productFeatures = product.features;

  featuresList.innerHTML = '';

  productFeatures.forEach((featureSet) => {
    const featureHeader = document.createElement('h3');
    featureHeader.textContent = featureSet.name;
    featuresList.appendChild(featureHeader);

    const featureList = document.createElement('ul');
    featureSet.items.forEach((item) => {
      const featureItem = document.createElement('li');
      featureItem.textContent = item;
      featureList.appendChild(featureItem);
    });
    featuresList.appendChild(featureList);
  });

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
    // ส่ง data.gallery ไปให้ฟังก์ชัน
    renderGallery(data.gallery);
}










// ฟังก์ชันแสดง Gallery ใหม่
function renderGallery(galleryData) {
  const container = document.querySelector('#gallery');
  container.innerHTML = '';

  // กรองเฉพาะรูปที่มีลิงก์เท่านั้น
  const validImages = galleryData.img.filter(img => img && img.trim() !== '');

  // ตรวจสอบว่ามีรูปหรือไม่
  if (validImages.length === 0) {
    container.innerHTML = `<p>No images available.</p>`; // แสดงข้อความเมื่อไม่มีรูป
    return;
  }

  // สร้าง HTML สำหรับรูปภาพ
  const imagesHTML = validImages.map(img => `
    <div class="gallery-item">
      <img src="${img}" alt="Gallery Image" data-full="${img}">
    </div>
  `).join('');

  // แทรก HTML ลงใน Container
  container.innerHTML = `
    <div class="gallery-category">
      ${imagesHTML}
    </div>
  `;

  // เพิ่ม Event Click ให้แต่ละรูป
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      window.open(img.dataset.full, '_blank'); // เปิดในแท็บใหม่
    });
  });
}


async function submitOrder() {
  const orderData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    houseNumber: document.getElementById('houseNumber').value,
    street: document.getElementById('street').value,
    village: document.getElementById('village').value,
    district: document.getElementById('district').value,
    amphoe: document.getElementById('amphoe').value,
    province: document.getElementById('province').value,
    zipcode: document.getElementById('zipcode').value,
  };

  try {
    const response = await fetch('https://zipherstore.vercel.app/scripts/api/save-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    if (result.success) {
      alert('สั่งซื้อสำเร็จ! ข้อมูลถูกบันทึกลง Neon Database');
    } else {
      alert('เกิดข้อผิดพลาด: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
  }
}

// กดปุ่ม Copy แล้วส่งข้อมูลเข้า DB
document.getElementById('copyButton').addEventListener('click', submitOrder);
