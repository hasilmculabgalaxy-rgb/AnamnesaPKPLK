// ====================================================================
// URL APPS SCRIPT
// ====================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3lkpIIf0jFcLGZxPonjbMDOuH5NC4fImA3MuXYfiE0F5qFG7RGCXEXBiR6qtjegxo2g/exec'; 

const form = document.getElementById('anamnesaForm');
const pesanStatus = document.getElementById('pesanStatus');

// Tambahan untuk halaman sukses
const formContainer = document.getElementById('form-container');
const thankYouPage = document.getElementById('thank-you-page');
const participantNameDisplay = document.getElementById('participant-name-display');


// ========================================================
// 1. CONDITIONAL DISPLAY — KELUHAN SEKARANG
// ========================================================
const keluhanAda = document.getElementById('keluhan_ada');
const keluhanTidak = document.getElementById('keluhan_tidak');
const keluhanContainer = document.getElementById('keluhan_sebutkan_container');
const keluhanInput = document.getElementById('keluhan_sebutkan_input');

function toggleKeluhanField() {
    if (keluhanAda.checked) {
        keluhanContainer.style.display = 'block';
        keluhanInput.required = true;
    } else {
        keluhanContainer.style.display = 'none';
        keluhanInput.value = '';
        keluhanInput.required = false;
    }
}

keluhanAda.addEventListener('change', toggleKeluhanField);
keluhanTidak.addEventListener('change', toggleKeluhanField);
toggleKeluhanField();


// ========================================================
// 2. CONDITIONAL DISPLAY — PENYAKIT KELUARGA LAINNYA
// ========================================================
const radioYa = document.getElementById('kel_lainnya_ya');
const radioTidak = document.getElementById('kel_lainnya_tidak');
const sebutkanContainer = document.getElementById('sebutkan_lainnya_container');
const sebutkanInput = document.getElementById('kel_lainnya_sebutkan_input');

function toggleSebutkanField() {
    if (radioYa.checked) {
        sebutkanContainer.style.display = 'block';
        sebutkanInput.required = true;
    } else {
        sebutkanContainer.style.display = 'none';
        sebutkanInput.value = '';
        sebutkanInput.required = false;
    }
}

radioYa.addEventListener('change', toggleSebutkanField);
radioTidak.addEventListener('change', toggleSebutkanField);
toggleSebutkanField();


// ========================================================
// 3. CONDITIONAL DISPLAY — RIWAYAT PENYAKIT SENDIRI (ALERGI & LAIN-LAIN)
// ========================================================

function setupRiwayatSebutkan(radioAdaId, radioTidakId, containerId, inputId) {
    const radioAda = document.getElementById(radioAdaId);
    const radioTidak = document.getElementById(radioTidakId);
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);

    function toggleField() {
        if (radioAda.checked) {
            container.style.display = 'block';
            input.required = true;
        } else {
            container.style.display = 'none';
            input.value = '';
            input.required = false;
        }
    }

    radioAda.addEventListener('change', toggleField);
    radioTidak.addEventListener('change', toggleField);
    toggleField();
    return toggleField; 
}

// Terapkan untuk H. Alergi Obat/makanan
const toggleAlergiField = setupRiwayatSebutkan(
    'riw_alergi_ada', 
    'riw_alergi_tidak', 
    'riw_alergi_sebutkan_container', 
    'riw_alergi_sebutkan_input'
);

// Terapkan untuk I. Riwayat Penyakit Lainnya
const toggleRiwLainField = setupRiwayatSebutkan(
    'riw_lain_ada', 
    'riw_lain_tidak', 
    'riw_lain_sebutkan_container', 
    'riw_lain_sebutkan_input'
);


// ========================================================
// 4. CONDITIONAL DISPLAY — KEBIASAAN (ALKOHOL, ROKOK)
// ========================================================
function setupConditionalInput(radioYesId, radioNoId, textInputSelector) {
    const yes = document.getElementById(radioYesId);
    const no = document.getElementById(radioNoId);
    const input = document.querySelector(textInputSelector);

    function toggle() {
        if (yes.checked) {
            input.style.display = 'inline-block';
            input.required = true;
        } else {
            input.style.display = 'none';
            input.value = '';
            input.required = false;
        }
    }

    yes.addEventListener('change', toggle);
    no.addEventListener('change', toggle);
    toggle();
}

// Alkohol
setupConditionalInput("alk_ya", "alk_tidak", "input[name='jumlah_alkohol']");

// Merokok
setupConditionalInput("rokok_ya", "rokok_tidak", "input[name='jumlah_rokok']");


// ========================================================
// 4B. CONDITIONAL DISPLAY — OLAHRAGA (frekuensi + jenis)
// ========================================================
const olYa = document.getElementById("ol_ya");
const olTidak = document.getElementById("ol_tidak");
const freqInput = document.querySelector("input[name='frekuensi_olahraga']");
const jenisContainer = document.createElement("div");

// Buat container jenis olahraga
jenisContainer.id = "jenis_olahraga_container";
jenisContainer.style.display = "none";
jenisContainer.innerHTML = `
    <label>Jenis Olahraga yang dilakukan:</label>
    <input type="text" name="jenis_olahraga" id="jenis_olahraga_input">
`;

// Sisipkan setelah frekuensi olahraga
freqInput.parentElement.insertAdjacentElement("afterend", jenisContainer);

const jenisInput = document.getElementById("jenis_olahraga_input");

function toggleOlahraga() {
    if (olYa.checked) {
        // tampilkan frekuensi
        freqInput.style.display = 'inline-block';
        freqInput.required = true;

        // tampilkan jenis olahraga
        jenisContainer.style.display = 'block';
        jenisInput.required = true;

    } else {
        // sembunyikan frekuensi
        freqInput.style.display = 'none';
        freqInput.value = '';
        freqInput.required = false;

        // sembunyikan jenis olahraga
        jenisContainer.style.display = 'none';
        jenisInput.value = '';
        jenisInput.required = false;
    }
}

olYa.addEventListener("change", toggleOlahraga);
olTidak.addEventListener("change", toggleOlahraga);
toggleOlahraga();


// ========================================================
// 5. SUBMIT FORM KE GOOGLE SHEETS & TAMPILKAN HALAMAN SUKSES (UPDATED FOR ALL DATA QR)
// ========================================================
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        pesanStatus.textContent = 'Mengirim data... Mohon tunggu.';
        pesanStatus.style.color = 'blue';

        const formData = new FormData(form);
        
        // Sebelum kirim, kosongkan input 'frekuensi_olahraga' dan 'jenis_olahraga' 
        // jika 'olahraga' adalah 'Tidak'
        if (olTidak.checked) {
            formData.set('frekuensi_olahraga', '');
            formData.set('jenis_olahraga', '');
        }

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                
                // --- AMBIL SEMUA DATA WAJIB UNTUK QR CODE ---
                const namaPeserta = document.querySelector('input[name="nama_peserta"]').value || 'NAMA TIDAK ADA';
                const nipNikPeserta = document.querySelector('input[name="nip_nik"]').value || 'NIP/NIK TIDAK ADA';
                const tglLahir = document.querySelector('input[name="tanggal_lahir"]').value || 'TGL LAHIR TIDAK ADA';
                const jenisKelamin = document.querySelector('select[name="jenis_kelamin"]').value || 'JK TIDAK ADA';
                const noHP = document.querySelector('input[name="no_handphone"]').value || 'HP TIDAK ADA';
                const unitKerja = document.querySelector('input[name="departemen"]').value || 'UNIT KERJA TIDAK ADA';
                
                // 2. Tentukan Konten QR Code (Gabungkan SEMUA data)
                // Konten ini akan terbaca saat QR discan
                const dataQR = 
                    `NAMA: ${namaPeserta.toUpperCase().trim()} | ` +
                    `NIP/NIK: ${nipNikPeserta.trim()} | ` +
                    `TGL LAHIR: ${tglLahir} | ` +
                    `JK: ${jenisKelamin} | ` +
                    `HP: ${noHP} | ` +
                    `UNIT: ${unitKerja.toUpperCase().trim()} | ` +
                    `WAKTU SUBMIT: ${new Date().toLocaleString('id-ID')}`;

                // 3. GENERATE QR CODE
                document.getElementById('qrcode-display').innerHTML = ''; 

                // Membuat instance QR Code baru
                // Pastikan Anda sudah menambahkan CDN qrcode.min.js di index.html Anda
                new QRCode(document.getElementById("qrcode-display"), {
                    text: dataQR,
                    width: 200,
                    height: 200,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H 
                });
                // END GENERATE QR CODE

                pesanStatus.textContent = '✅ Data anamnesa berhasil tersimpan! QR Code berhasil dibuat.';
                pesanStatus.style.color = 'green';
                
                // 4. Set nama di halaman terima kasih
                participantNameDisplay.textContent = namaPeserta ? namaPeserta.toUpperCase() : 'PESERTA';
                
                // 5. Sembunyikan form dan tampilkan halaman terima kasih
                formContainer.style.display = 'none';
                thankYouPage.style.display = 'block';

            } else {
                throw new Error(data.message || 'Gagal menyimpan data ke Apps Script.');
            }
        })
        .catch(error => {
            console.error('Error saat mengirim:', error);
            pesanStatus.textContent = `❌ Gagal menyimpan data: ${error.message}.`;
            pesanStatus.style.color = 'red';
        });
    });
}

