// Gerar calendário dos próximos 7 dias
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const daySlot = document.createElement('div');
        daySlot.className = 'day-slot';
        daySlot.dataset.date = date.toISOString().split('T')[0];
        
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString('pt-BR', { month: 'short' });
        
        daySlot.innerHTML = `
            <div style="font-weight: 600; text-transform: uppercase; font-size: 0.8em;">${dayName}</div>
            <div style="font-size: 1.5em; font-weight: 700; margin: 5px 0;">${dayNumber}</div>
            <div style="font-size: 0.8em; opacity: 0.7;">${month}</div>
        `;
        
        daySlot.addEventListener('click', () => selectDay(daySlot));
        calendarGrid.appendChild(daySlot);
    }
}

// Selecionar dia
function selectDay(daySlot) {
    document.querySelectorAll('.day-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    daySlot.classList.add('selected');
    generateTimeSlots();
    updateSubmitButton();
}

// Gerar horários disponíveis
function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    const hours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
                  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
    
    hours.forEach(hour => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = hour;
        timeSlot.dataset.time = hour;
        
        // Simular alguns horários indisponíveis aleatoriamente
        if (Math.random() > 0.7) {
            timeSlot.classList.add('unavailable');
        } else {
            timeSlot.addEventListener('click', () => selectTime(timeSlot));
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

// Selecionar horário
function selectTime(timeSlot) {
    if (timeSlot.classList.contains('unavailable')) return;
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    timeSlot.classList.add('selected');
    updateSubmitButton();
}

// Atualizar botão de envio
function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    const selectedDay = document.querySelector('.day-slot.selected');
    const selectedTime = document.querySelector('.time-slot.selected');
    
    submitBtn.disabled = !(selectedDay && selectedTime);
}

// Submeter formulário
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const selectedDay = document.querySelector('.day-slot.selected').dataset.date;
    const selectedTime = document.querySelector('.time-slot.selected').dataset.time;
    const topic = document.getElementById('topic').value;
    
    // Salvar dados do agendamento
    window.bookingData = { name, email, phone, selectedDay, selectedTime, topic };
    
    console.log('Agendamento:', window.bookingData);
    
    // Mostrar modal de pagamento
    document.getElementById('paymentModal').classList.add('active');
});

// Selecionar método de pagamento
function selectPayment(method) {
    document.getElementById('paymentModal').classList.remove('active');
    
    if (method === 'pix') {
        document.getElementById('pixModal').classList.add('active');
        // Aqui você integraria com API do PIX
        simulatePixPayment();
    } else if (method === 'credit') {
        document.getElementById('creditModal').classList.add('active');
    } else if (method === 'transfer') {
        document.getElementById('transferModal').classList.add('active');
    }
}

// Copiar código PIX
function copyPixCode() {
    const input = document.querySelector('#pixModal input[type="text"]');
    input.select();
    document.execCommand('copy');
    alert('✅ Código PIX copiado!');
}

// Simular pagamento PIX (em produção, você verificaria via webhook)
function simulatePixPayment() {
    setTimeout(() => {
        if (confirm('Simular pagamento recebido? (Em produção, isso seria automático via webhook)')) {
            closePixModal();
            showSuccessModal();
        }
    }, 3000);
}

// Processar cartão de crédito
document.getElementById('creditForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Aqui você integraria com Stripe, Mercado Pago, etc
    alert('Processando pagamento...\n\n(Integração pendente - você precisará configurar gateway de pagamento)');
    
    setTimeout(() => {
        closeCreditModal();
        showSuccessModal();
    }, 1500);
});

// Formatar número do cartão
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Confirmar transferência bancária
function confirmTransfer() {
    closeTransferModal();
    
    // Alterar mensagem de sucesso para transferência
    const successModal = document.getElementById('successModal');
    const h3 = successModal.querySelector('h3');
    const firstP = successModal.querySelectorAll('p')[0];
    
    h3.textContent = 'Aguardando Confirmação!';
    firstP.innerHTML = 'Obrigado! Assim que recebermos seu comprovante,<br>confirmaremos seu agendamento por email.';
    
    showSuccessModal();
}

// Mostrar modal de sucesso
function showSuccessModal() {
    const data = window.bookingData;
    const date = new Date(data.selectedDay);
    const dateFormatted = date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    document.getElementById('bookingDetails').innerHTML = `
        📅 ${dateFormatted}<br>
        ⏰ ${data.selectedTime}<br>
        📧 ${data.email}
    `;
    
    document.getElementById('successModal').classList.add('active');
    
    // Resetar formulário
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.day-slot, .time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    updateSubmitButton();
}

// Fechar modais
function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function closePixModal() {
    document.getElementById('pixModal').classList.remove('active');
}

function closeCreditModal() {
    document.getElementById('creditModal').classList.remove('active');
}

function closeTransferModal() {
    document.getElementById('transferModal').classList.remove('active');
}

// Inicializar calendário quando a página carregar
generateCalendar();