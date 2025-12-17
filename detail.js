function getDetail() {
    const productDetail = document.getElementById("productDetail");
    if (!productDetail) {
        return;
    }
    
    // Show enhanced loading
    productDetail.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading Product Details...</div>
        </div>
    `;
    
    const params = new URLSearchParams(location.search);
    const productID = params.get("id");

    if(!productID) {
        productDetail.innerHTML = `
            <div class="loading-container">
                <div class="loading-text">ID Tidak Ditemukan!</div>
            </div>
        `;
        return;
    }

    fetch("assets/data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const item = data.find(row => row.id === productID);

        if(!item) {
            productDetail.innerHTML = `
                <div class="loading-container">
                    <div class="loading-text">Produk Tidak Ditemukan!</div>
                </div>
            `;
            return;
        }

        productDetail.innerHTML = `
            <div class="detail-card" data-accent="${item.id}">
                <div class="detail-hero" style="background-image: url('${item.image}')"></div>
                <div class="detail-body">
                    <a href="index.html" class="back">&#8592; Kembali</a>
                    <h1>${item.title}</h1>
                    <p>${item.subtitle}</p>
                    <div id="detailBody"></div>
                    <div class="detail-stats">
                        <div class="stat">
                            <span class="label">Warna</span>
                            <span class="value">${item.color}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Baterai</span>
                            <span class="value">${item.battery}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Bobot</span>
                            <span class="value">${item.weight}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Latency</span>
                            <span class="value">${item.latency}</span>
                        </div>

                        <div class="stat">
                            <span class="label">Harga</span>
                            <span class="value">${item.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const detailBody = document.getElementById("detailBody");
        const paragraphs = (item.detail_description || "").split(/\n+/);
        paragraphs.forEach((text, index) => {
            const trimmed = text.trim();
            if (!trimmed) {
                return;
            }
            const p = document.createElement("p");
            p.textContent = trimmed;
            p.style.animationDelay = `${index * 0.1}s`;
            p.style.opacity = "0";
            p.style.transform = "translateY(20px)";
            p.style.animation = "slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards";
            detailBody.appendChild(p);
        })

    })
    .catch(() => {
        productDetail.innerHTML = `
            <div class="loading-container">
                <div class="loading-text">Gagal memuat data produk.</div>
            </div>
        `;
    })
}

getDetail();