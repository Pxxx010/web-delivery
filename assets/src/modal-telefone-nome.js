document.addEventListener("DOMContentLoaded", function () {
    const customerModal = document.getElementById("customer-modal");
    const customerForm = document.getElementById("customer-form");

    // Função para verificar se os dados do cliente estão no LocalStorage
    function checkCustomerData() {
        const customerName = localStorage.getItem("customerName");
        const customerPhone = localStorage.getItem("customerPhone");

        if (!customerName || !customerPhone) {
            // Exibe o modal se os dados não estiverem salvos
            customerModal.classList.remove("hidden");
            console.log("Dados ausentes.");
        } else {
            console.log("Dados encontrados.");
        }
    }

    // Função para fechar o modal
    function closeModal() {
        customerModal.classList.add("hidden");
    }

    // Executa a verificação ao carregar a página
    checkCustomerData();

    // Salvar nome e telefone no LocalStorage ao enviar o formulário
    customerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const customerName = document.getElementById("customer-name").value.trim();
        const customerPhone = document.getElementById("customer-phone").value.trim();

        if (customerName && customerPhone) {
            localStorage.setItem("customerName", customerName);
            localStorage.setItem("customerPhone", customerPhone);
            closeModal(); // Fecha o modal
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });
});
