const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const customerNameInput = document.getElementById("customer-name");
const customerPhoneInput = document.getElementById("customer-phone");
const paymentInputs = document.querySelectorAll("input[name='payment-method']");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>
          <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
          </button>
        </div>
        `;
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        alert("O restaurante está fechado no momento.");
        return;
    }

    if (cart.length === 0) return;

    // Verificar se uma forma de pagamento foi selecionada
    const paymentMethod = Array.from(paymentInputs).find(input => input.checked)?.value;
    if (!paymentMethod) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    // Montando os dados do pedido
    const cartItems = cart.map((item) => {
        return `${item.name} (${item.quantity}x)`;
    }).join(", ");

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    const customerName = customerNameInput.value;
    const customerPhone = customerPhoneInput.value;

    // Adicionar data e hora
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    // Criar mensagem
    const message = encodeURIComponent(`
====================================
📅 Data: ${formattedDate} 
⏰ Hora: ${formattedTime}

Pedido para Delivery
Nome: ${customerName}
Telefone: ${customerPhone}

Produtos: ${cartItems}

💠 Pagamento:
Forma de pagamento: ${paymentMethod}
Total: R$ ${totalPrice}
====================================

👆 Por favor, envie-nos esta mensagem agora. Assim que recebermos estaremos atendendo você.
    `);

    const phone = "+5581983191149"; // Número do WhatsApp

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar carrinho após envio
    cart = [];
    updateCartModal();
});

// Função para verificar se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 15 && hora < 23; // O restaurante está aberto das 15h até as 23h
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
