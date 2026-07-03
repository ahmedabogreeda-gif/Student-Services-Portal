// ===== Global Functions =====

// Toggle Mobile Menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // التحقق البسيط (في الواقع يرسل للـ Backend)
    if (email && password) {
        // تحديد نوع المستخدم (للعرض التوضيحي)
        if (email.includes('admin')) {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'student-dashboard.html';
        }
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('❌ كلمات المرور غير متطابقة!');
        return;
    }

    alert('✅ تم إنشاء الحساب بنجاح! سيتم تحويلك...');
    window.location.href = 'student-dashboard.html';
}

// ===== Dashboard Functions =====

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Show Section (Student)
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // تحديث الـ active في القائمة
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // إغلاق السايدبار في الموبايل
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// Show Admin Section
function showAdminSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById('admin-' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// ===== Order Form Steps =====

function nextStep(step) {
    // إخفاء الخطوة الحالية
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // إظهار الخطوة التالية
    document.getElementById('step' + step).classList.add('active');

    // تحديث المؤشر
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });
    document.querySelector('.step-indicator[data-step="' + step + '"]').classList.add('active');

    // تحديث ملخص الدفع إذا كان الخطوة 3
    if (step === 3) {
        updatePaymentSummary();
    }
}

function prevStep(step) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('step' + step).classList.add('active');

    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active');
    });
    document.querySelector('.step-indicator[data-step="' + step + '"]').classList.add('active');
}

function updatePaymentSummary() {
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const subject = document.querySelector('select[name="subject"]')?.value || '-';

    const typeNames = {
        'homework': 'واجب',
        'research': 'بحث',
        'exam': 'اختبار',
        'project': 'مشروع'
    };

    const prices = {
        'homework': '50',
        'research': '150',
        'exam': '80',
        'project': '250'
    };

    document.getElementById('summaryType').textContent = typeNames[orderType] || orderType;
    document.getElementById('summarySubject').textContent = subject;
    document.getElementById('summaryAmount').textContent = prices[orderType] + ' ريال';
}

function handleNewOrder(e) {
    e.preventDefault();

    const receiptFile = document.getElementById('receiptFile');
    if (!receiptFile.files.length) {
        alert('❌ يرجى رفع إيصال التحويل!');
        return;
    }

    alert('✅ تم إرسال طلبك بنجاح! سيتم مراجعة الإيصال والتواصل معك قريباً.');

    // إعادة تعيين النموذج والعودة للخطوة الأولى
    e.target.reset();
    nextStep(1);
    showSection('orders');
}

// ===== Chat Functions =====

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    // إضافة رسالة المرسل
    const sentMessage = document.createElement('div');
    sentMessage.className = 'message sent';
    sentMessage.innerHTML = `
        <div class="message-bubble">
            <p>${escapeHtml(message)}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    chatMessages.appendChild(sentMessage);

    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // محاكاة رد الأدمن بعد 2 ثانية
    setTimeout(() => {
        const replies = [
            'تم استلام رسالتك، سيتم الرد عليك قريباً ✅',
            'شكراً لتواصلك معنا! 🙏',
            'سنقوم بمراجعة طلبك والرد عليك في أقرب وقت',
            'هل تحتاج مساعدة في شيء آخر؟'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const receivedMessage = document.createElement('div');
        receivedMessage.className = 'message received';
        receivedMessage.innerHTML = `
            <div class="message-bubble">
                <p>${randomReply}</p>
                <span class="message-time">${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
        chatMessages.appendChild(receivedMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
}

function sendAdminMessage() {
    const input = document.getElementById('adminMessageInput');
    const message = input.value.trim();

    if (!message) return;

    const chatMessages = document.getElementById('adminChatMessages');
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    const sentMessage = document.createElement('div');
    sentMessage.className = 'message sent';
    sentMessage.innerHTML = `
        <div class="message-bubble">
            <p>${escapeHtml(message)}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    chatMessages.appendChild(sentMessage);

    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== Receipt Verification =====

function verifyReceipt(btn) {
    const receiptCard = btn.closest('.receipt-card') || btn.closest('.receipt-item');

    if (confirm('✅ هل أنت متأكد من صحة هذا الإيصال؟')) {
        receiptCard.style.opacity = '0.5';
        receiptCard.style.pointerEvents = 'none';

        // إضافة علامة التحقق
        const verifiedBadge = document.createElement('div');
        verifiedBadge.className = 'verified-badge';
        verifiedBadge.innerHTML = '✅ تم التحقق';
        verifiedBadge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #22c55e;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            z-index: 10;
        `;
        receiptCard.style.position = 'relative';
        receiptCard.appendChild(verifiedBadge);

        alert('✅ تم التحقق من الإيصال بنجاح!');
    }
}

function rejectReceipt(btn) {
    const receiptCard = btn.closest('.receipt-card') || btn.closest('.receipt-item');
    const reason = prompt('❌ يرجى كتابة سبب الرفض:');

    if (reason) {
        receiptCard.style.opacity = '0.3';
        receiptCard.style.pointerEvents = 'none';

        const rejectedBadge = document.createElement('div');
        rejectedBadge.className = 'rejected-badge';
        rejectedBadge.innerHTML = '❌ مرفوض: ' + escapeHtml(reason);
        rejectedBadge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ef4444;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            z-index: 10;
        `;
        receiptCard.style.position = 'relative';
        receiptCard.appendChild(rejectedBadge);

        alert('❌ تم رفض الإيصال وإرسال السبب للطالب.');
    }
}

// ===== Settings Tabs =====

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

// ===== Utility Functions =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== File Upload Preview =====
document.addEventListener('DOMContentLoaded', function() {
    // معاينة الملفات المرفوعة
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                const uploadArea = this.closest('.file-upload');
                const fileNames = Array.from(files).map(f => f.name).join(', ');
                uploadArea.innerHTML = `
                    <span class="upload-icon">📎</span>
                    <span>${fileNames}</span>
                    <small>اضغط لتغيير الملف</small>
                `;
                uploadArea.style.borderColor = 'var(--success)';
                uploadArea.style.background = '#f0fdf4';
            }
        });
    });

    // إرسال الرسالة بالضغط على Enter
    const messageInputs = document.querySelectorAll('.chat-input input');
    messageInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const isAdmin = this.id === 'adminMessageInput';
                isAdmin ? sendAdminMessage() : sendMessage();
            }
        });
    });

    // تحديث ملخص الدفع عند تغيير النوع
    const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
    orderTypeInputs.forEach(input => {
        input.addEventListener('change', updatePaymentSummary);
    });
});

// ===== Notifications System =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Search Filter =====
function filterTable(tableSelector, searchValue) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const search = searchValue.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}

// ===== Export Functions =====
function exportToCSV(tableSelector, filename) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    let csv = '';
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData = Array.from(cells).map(cell => `"${cell.textContent.trim()}"`).join(',');
        csv += rowData + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '.csv';
    link.click();
}
