// --- KONFIGURASI API ---
const API_URL = 'http://localhost:3000/api'; // Pastikan backend Anda berjalan

// 1. State Awal (Default Pelanggan)
let currentRole = 'pelanggan';

// 2. Fungsi Ganti Peran (UI Only)
function switchRole(role) {
    currentRole = role;
    
    const btnPelanggan = document.getElementById('btn-pelanggan');
    const btnTukang = document.getElementById('btn-tukang');
    const btnSubmit = document.getElementById('btn-submit');
    
    // Reset Input agar bersih saat ganti peran
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    if (role === 'pelanggan') {
        // === STYLE PELANGGAN (BIRU) ===
        btnPelanggan.classList.add('active');
        btnPelanggan.style.backgroundColor = '#0d6efd'; // Biru Bootstrap
        
        btnTukang.classList.remove('active');
        btnTukang.style.backgroundColor = 'transparent';

        btnSubmit.innerText = "Masuk sebagai Pelanggan";
        // Tombol Submit Biru
        btnSubmit.className = "btn btn-primary w-100 btn-lg fw-bold shadow-sm"; 
    } else {
        // === STYLE MITRA TUKANG (SEKARANG JADI BIRU JUGA) ===
        btnTukang.classList.add('active');
        btnTukang.style.backgroundColor = '#0d6efd'; // UBAH KE BIRU (#0d6efd)
        
        btnPelanggan.classList.remove('active');
        btnPelanggan.style.backgroundColor = 'transparent';

        btnSubmit.innerText = "Masuk sebagai Mitra";
        // Tombol Submit Biru (btn-primary) agar sama dengan Pelanggan
        btnSubmit.className = "btn btn-primary w-100 btn-lg fw-bold shadow-sm"; 
    }
}

// 3. Fungsi Login Utama (TERINTEGRASI API)
async function handleLogin(event) {
    event.preventDefault(); // Mencegah reload halaman

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validasi sederhana
    if (!email || !password) {
        alert("Mohon isi email dan password!");
        return;
    }

    // Ubah tombol jadi loading
    const btnSubmit = document.getElementById('btn-submit');
    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = "Memproses...";
    btnSubmit.disabled = true;

    try {
        // Kirim request ke Backend
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, 
                password: password,
                role: currentRole // Penting: Kirim peran ke backend
            })
        });

        const result = await response.json();

        if (result.success) {
            // Simpan data user ke LocalStorage
            const sessionData = {
                ...result.user, 
                role: currentRole 
            };
            localStorage.setItem('user_session', JSON.stringify(sessionData));

            // LOGIKA PENGALIHAN HALAMAN (REDIRECT)
            if (currentRole === 'tukang') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'Beranda.html';
            }

        } else {
            alert('❌ Login Gagal: ' + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Gagal terhubung ke server. Pastikan backend menyala.');
    } finally {
        // Kembalikan tombol ke semula
        btnSubmit.innerText = originalText;
        btnSubmit.disabled = false;
    }
}

// 4. Jalankan saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    switchRole('pelanggan'); // Set default ke pelanggan
});