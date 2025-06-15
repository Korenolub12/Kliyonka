// Глобальний об'єкт кошика
const cart = {
    items: JSON.parse(localStorage.getItem('cart')) || {},
    
    addItem(item) {
      if (this.items[item.title]) {
        this.items[item.title].quantity += 1;
      } else {
        this.items[item.title] = {...item, quantity: 1};
      }
      this.save();
      this.updateCounter();
      this.showAddedNotification(item.title);
    },
    
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    updateCounter() {
      const counter = document.querySelector('.cart-counter');
      if (counter) {
        const total = Object.values(this.items).reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = total;
        counter.style.display = total > 0 ? 'flex' : 'none';
      }
    },
    
    showAddedNotification(title) {
      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.innerHTML = `
        <span>✓</span> ${title} додано до кошика
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };
  
  // Завантаження та відображення товарів
  async function loadProducts() {
    try {
      const response = await fetch('store_db.json');
      if (!response.ok) throw new Error('Не вдалося завантажити товари');
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Помилка:', error);
      document.querySelector('.products-list').innerHTML = `
        <div class="error-message">Не вдалося завантажити товари. Спробуйте оновити сторінку.</div>
      `;
    }
  }
  
  function displayProducts(products) {
    const container = document.querySelector('.products-list');
    if (!container) return;
  
    container.innerHTML = products.map(product => `
      <div class="game-product-card">
        <div class="game-product-image-wrapper">
          <img src="img/${product.image}" alt="${product.title}" class="game-product-image">
          <div class="game-product-badge">NEW</div>
        </div>
        <div class="game-product-content">
          <h3 class="game-product-title">${product.title}</h3>
          <div class="game-product-description">${product.description}</div>
          <div class="game-product-footer">
            <div class="game-product-price">${product.price} грн</div>
            <button class="game-product-button cart-btn" 
                    data-product='${JSON.stringify(product)}'>
              В КОШИК
            </button>
          </div>
        </div>
      </div>
    `).join('');
  
    // Додаємо обробники кнопок
    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const product = JSON.parse(e.currentTarget.dataset.product);
        cart.addItem(product);
        
        // Анімація кнопки
        e.currentTarget.innerHTML = '<span>✓</span> ДОДАНО';
        setTimeout(() => {
          e.currentTarget.innerHTML = 'В КОШИК';
        }, 2000);
      });
    });
  }
  
  // Ініціалізація
  document.addEventListener('DOMContentLoaded', () => {
    // Завантажуємо товари тільки на головній сторінці
    if (document.querySelector('.products-list')) {
      loadProducts();
      cart.updateCounter();
    }
    
    // Обробник для кнопки кошика
    document.getElementById('cart')?.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  });