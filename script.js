const canvas = document.getElementById("circleMenu");
const ctx = canvas.getContext("2d");

// Canvas o'lchami
canvas.width = 600;
canvas.height = 600;

// Markaz koordinatalari va radiuslar
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = 270;
const innerRadius = 90; // Markaziy aylana radiusi

// Bo'laklar va ularning ma'lumotlari
const sections = [
    { text: "Док для приход", icon: "./icons/navigation/приход.svg", link: null },
    { text: "Касса", icon: "./icons/navigation/касса.svg", link: "./касса.html" },
    { text: "Отчеты", icon: "./icons/navigation/oтчеты.svg", link: "./oтчеты.html" },
    { text: "Сервис", icon: "./icons/navigation/cервис.svg", link: "./сервис .html" },
    { text: "Справочники", icon: "./icons/navigation/cправочники.svg", link: "./cправочники.html" },
    { text: "Дт-Кт клиент Пос", icon: "./icons/navigation/клиет.svg", link: "./клиент.html" },
];

// Ranglar
const baseColor = "rgba(2, 181, 167, 1)";
const hoverColor = "rgba(2, 181, 167, 1)";
const shadowColor = "rgba(0, 0, 0, 0.3)";
const centerBorderColor = "rgba(5, 138, 0, 1)";

// Har bir bo'lakning burchagi
const sliceAngle = (2 * Math.PI) / sections.length;

// Hover va klik uchun ma'lumotlar
let hoveredIndex = null;

// Silliq hover animatsiyasi uchun
let currentRadii = new Array(sections.length).fill(outerRadius);
const icons = [];
sections.forEach((section, index) => {
    const icon = new Image();
    icon.src = section.icon;
    icons[index] = icon;
});

// Logoni yuklash boshqaruvi
const logo = new Image();
logo.src = "./icons/logo.svg"; // Logoning havolasi
let isLogoLoaded = false;

// Logoning yuklanganligini kuzatish
logo.onload = () => {
    isLogoLoaded = true;
};

// Bo'laklarni chizish
function drawSlices() {
    sections.forEach((section, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Hover qilingan bo'lak uchun radiusni o'zgartirish
        const targetRadius = hoveredIndex === index ? outerRadius + 10 : outerRadius;
        currentRadii[index] += (targetRadius - currentRadii[index]) * 0.2;

        // Bo'lakni chizish
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, currentRadii[index], startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = hoveredIndex === index ? hoverColor : baseColor;
        ctx.fill();

        // Chegara
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();

        // Matn va ikonlarni joylashtirish
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (outerRadius + innerRadius) / 2;
        const textY = centerY + Math.sin(textAngle) * (outerRadius + innerRadius) / 2;

        // Ikonni chizish
        const iconSize = 29; // Ikon hajmi
        const icon = icons[index];
        const gap = 5; // Ikon va matn orasidagi masofa
        if (icon.complete) {
            const totalWidth = iconSize + gap + ctx.measureText(section.text).width;
            ctx.drawImage(icon, textX - totalWidth / 2, textY - iconSize / 2, iconSize, iconSize);

            // Matnni chizish
            ctx.fillStyle = "white";
            ctx.font = "18px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(section.text, textX - totalWidth / 2 + iconSize + gap, textY);
        }
    });
}

// Markazni chizish
function drawCenter() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fill();
    ctx.strokeStyle = centerBorderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Logoni chizish
    if (isLogoLoaded) {
        const logoWidth = 150; // Logoning kengligi
        const logoHeight = 35; // Logoning balandligi

        ctx.drawImage(
            logo,
            centerX - logoWidth / 2,
            centerY - logoHeight / 2,
            logoWidth,
            logoHeight
        );
    }
}

// To'liq chizma funksiyasi
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlices();
    drawCenter();
    requestAnimationFrame(draw); // Silliq animatsiya
}

// Hover qilingan bo'lakni aniqlash
function getHoveredSlice(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Tashqi radius va ichki radius orasida bo'lsa davom etadi
    if (distance < innerRadius || distance > outerRadius + 10) return null;

    // Burchakni hisoblash
    const angle = Math.atan2(dy, dx);
    const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI); // Salbiy burchaklarni to'g'rilash

    // Bo'lak indeksini topish
    return Math.floor(normalizedAngle / sliceAngle);
}

// Mouse hodisalari
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const sliceIndex = getHoveredSlice(mouseX, mouseY);

    if (sliceIndex !== hoveredIndex) {
        hoveredIndex = sliceIndex;
        canvas.style.cursor = hoveredIndex !== null ? "pointer" : "default";
    }
});

canvas.addEventListener("click", (e) => {
    if (hoveredIndex !== null) {
        window.location.href = sections[hoveredIndex].link; // Tegishli sahifaga o'tadi
    }
});

// Chizishni boshlash
draw();
