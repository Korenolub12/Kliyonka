document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо кошик з localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    // Елементи DOM
    const cartList = document.querySelector('.cart-items-list');
    const totalElement = document.querySelector('.total-amount');
    const orderBtn = document.getElementById('orderBtn');
    const orderForm = document.querySelector('.order-form');
    
    // Відображення кошика
    function renderCart() {
      if (Object.keys(cart).length === 0) {
        cartList.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Ваш кошик порожній</p>
            <a href="index.html" class="back-to-shop">Повернутись до магазину</a>
          </div>
        `;
        orderBtn.style.display = 'none';
        totalElement.textContent = '0 грн';
        return;
      }
      
      let total = 0;
      cartList.innerHTML = '';
      
      Object.values(cart).forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartList.innerHTML += `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.title}</h4>
              <div class="cart-item-meta">
                <span>${item.price} грн × ${item.quantity}</span>
              </div>
            </div>
            <div class="cart-item-total">${itemTotal} грн</div>
          </div>
        `;
      });
      
      totalElement.textContent = `${total} грн`;
      orderBtn.style.display = 'block';
    }
    
    // Обробник оформлення замовлення
    orderBtn?.addEventListener('click', () => {
      document.querySelector('.order').style.display = 'block';
      orderBtn.style.display = 'none';
    });
    
    orderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Тут можна додати відправку даних на сервер
      alert('Замовлення успішно оформлено!');
      
      // Очищаємо кошик
      localStorage.removeItem('cart');
      window.location.href = 'index.html';
    });
    
    // Ініціалізація
    renderCart();
  });