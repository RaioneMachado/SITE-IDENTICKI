document.getElementById("inscricaoForm").addEventListener("submit", async function(e) {
    e.preventDefault();  // Evita o comportamento padrão de envio do formulário

    const loading = document.getElementById("loading");
    const success = document.getElementById("formSuccess");
    const submitButton = document.querySelector("button[type='submit']");

    submitButton.disabled = true; // Desabilita o botão para evitar múltiplos cliques
    loading.classList.remove("hidden");  // Mostra o ícone de carregamento

    // Captura os dados do formulário
    const formData = new FormData(this);

    // URL do seu Google Apps Script
    const urlDoScript = "https://script.google.com/macros/s/AKfycbyyHM9L7c79Iruy-pBsO3FD85Fa_vynilsIAcRlARKtzNJ237BoPPyJPBXveYptcKd1/exec"; 

    // Define o redirecionamento após o envio
    formData.append("_next", "https://pay.kiwify.com.br/SPgJq6Q"); // URL do pagamento

    try {
        // Envia os dados para o Google Apps Script
        const response = await fetch(urlDoScript, {
            method: "POST",
            body: formData
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            const result = await response.json();  // Converte a resposta para JSON

            if (result.success) {
                loading.classList.add("hidden");  // Esconde o ícone de carregamento
                success.classList.remove("hidden");  // Mostra a mensagem de sucesso

                // Redireciona imediatamente para a página de pagamento
                window.location.href = "https://pay.kiwify.com.br/SPgJq6Q";  // URL do checkout
            } else {
                alert("Falha ao processar os dados no servidor.");
                loading.classList.add("hidden");  // Esconde o ícone de carregamento
            }
        } else {
            alert("Erro ao enviar o formulário. Tente novamente.");
            loading.classList.add("hidden");  // Esconde o ícone de carregamento
        }
    } catch (error) {
        // Caso ocorra um erro de conexão, mostra um alerta
        alert("Erro de conexão. Verifique sua internet.");
        loading.classList.add("hidden");  // Esconde o ícone de carregamento
    } finally {
        submitButton.disabled = false; // Reabilita o botão após o envio ser completado
    }
});
