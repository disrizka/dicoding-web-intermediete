export default class AboutPage {
  async render() {
    return `
      <section class="container about-section">
        <h1>🌟 About This App</h1>
        <p>
          <strong>Story App</strong> adalah platform berbasis web yang memungkinkan pengguna
          untuk berbagi cerita, pengalaman, dan lokasi penting secara visual dan interaktif.
        </p>

        <div class="about-cards">
          <div class="about-card">
            <i data-feather="map-pin"></i>
            <h3>Berbagi Lokasi</h3>
            <p>Tambahkan lokasi unik Anda dan lihat di peta interaktif dengan marker otomatis.</p>
          </div>

          <div class="about-card">
            <i data-feather="camera"></i>
            <h3>Ambil Foto Langsung</h3>
            <p>Gunakan kamera langsung dari perangkat Anda untuk menambah visualisasi cerita.</p>
          </div>

          <div class="about-card">
            <i data-feather="smartphone"></i>
            <h3>Mobile Friendly</h3>
            <p>Dibuat dengan tampilan yang nyaman di semua ukuran layar.</p>
          </div>
        </div>

        <p style="margin-top: 2rem;">Developed with ❤️ by <strong>Rizka</strong>.</p>
      </section>
    `;
  }

  async afterRender() {
    if (window.feather) feather.replace();
  }
}
