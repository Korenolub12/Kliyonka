/* Файл із спільними скриптами для всього сайту (анімації, меню, кошик) */

// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("store_db.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    return `
       <div class="game-product-card">
    <div class="game-product-image-wrapper">
        <img src="img/${product.image}" alt="${product.title}" class="game-product-image">
        <div class="game-product-badge">NEW</div>
    </div>
    
    <div class="game-product-content">
        <h3 class="game-product-title">${product.title}</h3>
        
        <div class="game-product-description">
            ${product.description}
        </div>
        
        <div class="game-product-footer">
            <div class="game-product-price">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f5d742" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M8 7a2.64 2.64 0 0 1 2.562 -2h3.376a2.64 2.64 0 0 1 2.562 2a2.57 2.57 0 0 1 -1.344 2.922l-5.876 2.938a3.338 3.338 0 0 0 -1.78 3.64a3.11 3.11 0 0 0 3.05 2.5h2.888a2.64 2.64 0 0 0 2.562 -2"/>
                    <path d="M6 10h12"/>
                    <path d="M6 14h12"/>
                </svg>
                <span>${product.price}</span>
            </div>
            
            <button class="game-product-button" data-product='${JSON.stringify(product)}'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
                    <path d="M12.5 17h-6.5v-14h-2"/>
                    <path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5"/>
                    <path d="M16 19h6"/>
                    <path d="M19 16v6"/>
                </svg>
                В КОШИК
            </button>
        </div>
    </div>
</div>
    `;
}

// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})


// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('index2.html');
});

// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }

    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.saveCartToCookies();
    }


    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика 
let cart = new ShoppingCart();


// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);

    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}
let cart_list = document.querySelector('.cart-items-list')
let cart_total = document.querySelector('.cart-total')
let orderBtn = document.querySelector("#orderBtn")
let orderSection = document.querySelector(".order")



function get_item(item) {
    return `<div class = "cart-item">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-quantity">Кількість: ${item.quantity}</div>
                <div class="cart-item-price" data-price="${item.price}">${item.price * item.quantity} грн</div>
            </div>`
}

function showCartList() {
    cart_list.innerHTML = ''
    for (let key in cart.items) { // проходимося по всіх ключах об'єкта cart.items
        cart_list.innerHTML += get_item(cart.items[key])
    }
    cart_total.innerHTML = cart.calculateTotal()
}

showCartList()

orderBtn.addEventListener("click", function (event) {
    orderBtn.style.display = "none"
    orderSection.style.display = "block"
    anime({
        targets: '.order',
        opacity: 1, // Кінцева прозорість (1 - повністю видимий)
        duration: 1000, // Тривалість анімації в мілісекундах
        easing: 'easeInOutQuad'
    })
})
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.querySelector('.cart-btn-form.margin-y');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Тут можна додати валідацію форми
            const form = document.querySelector('.order-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Очищаємо кошик
            cart.items = {};
            cart.saveCartToCookies();
            
            // Оновлюємо відображення кошика
            showCartList();
            
            // Показуємо модальне вікно з подякою
            showThankYouModal();
            
            // Приховуємо форму після підтвердження
            document.querySelector('.order').style.display = 'none';
        });
    }
});

function showThankYouModal() {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Дякуємо за ваше замовлення!</h3>
            <p>Ваше замовлення успішно оформлено. Наш менеджер зв'яжеться з вами найближчим часом.</p>
            <button class="close-modal">Закрити</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закриття модального вікна
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Стилі для модального вікна
    const style = document.createElement('style');
    style.textContent = `
        .thank-you-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }
        .close-modal {
            background-color: #2a4365;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
        }
    `;
    document.head.appendChild(style);
}